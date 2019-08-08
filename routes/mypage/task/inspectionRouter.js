const express = require("express");
const router = express.Router();
const db = require('../../../db/index');

// path: ~/mypage/task/inspection
router.use("/", (req, res, next) => {
  console.log("/inspection 라우터 도착");
  next();
});

// 검수 큐에 있는 data를 시간이 빠른 순서대로 불러온다
// 자신이 한번도 참여하지 않았고 상태가 'queued'인 data를 불러온다
// 그리고 해당 data의 상태를 'reserved' 로 변경한다
// 그리하여 다른 검수 작업자가 해당 data에 접근하지 못 하게 한다
router.get('/', (req, res, next) => {
  db.query(
    `begin;
    lock table data in exclusive mode;
    update data 
    set schedule_state='reserved' 
    where id in (
      select 
        id from data 
      where 
        schedule_state='queued' 
        and 
        '${req.user.id}' != ALL(inspector) 
      order by 
        created_at asc 
      limit 1 
    )
    returning *;
    commit;`,
    [],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      if (result[2].rows.length === 0) {
        return res.json({ message: '참여 가능한 검수 작업이 존재하지 않습니다' });
      }
      return res.json({ result: result[2].rows[0] });
    }
  )
})

// 작업 완료 요청 핸들링
// reserved 상태 였던 data를 다시 queue로 되돌린다
// 지금으로썬 payload 부분을 수정하지 않고, 다른 작업자들한테 어떻게 보이는지 테스트 해본다
router.post('/', (req, res, next) => {

  const data = req.body.data;
  console.log(data);

  db.query(
    `
    update data
    set schedule_state='queued', inspector = array_append(inspector, '${req.user.id}')
    where id='${data.id}'
    `,
    [],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      return res.json({ result: true });
    }
  )
})

module.exports = router;
