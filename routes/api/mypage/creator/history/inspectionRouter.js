const express = require("express");
const router = express.Router();
const db = require("../../../../../db/index");
const logger = require("../../../../../config/logger");

// path: ~/api/mypage/creator/task/inspection
// 검수 큐에 있는 data를 시간이 빠른 순서대로 불러온다
// 자신이 한번도 참여하지 않았고 상태가 'queued'인 data를 불러온다
// 그리고 해당 data의 상태를 'reserved' 로 변경한다
// 그리하여 다른 검수 작업자가 해당 data에 접근하지 못 하게 한다
router.get("/", (req, res, next) => {
  const data_id = req.query.data_id;
  console.log(data_id);
  const production_sql = `
    select 
      * from data 
    where 
      id ='${data_id}'`;

  // const debug_sql = `;
  //   select * from data order by created_at asc limit 1
  // `;
  db.query(production_sql, [], (err, result) => {
    if (err) {
      logger.error(err);
      return res.status(500).send(err);
    }
    return res.json({ result: result.rows });
  });
});

module.exports = router;
