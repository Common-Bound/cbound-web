const express = require("express");
const router = express.Router();
const db = require("../../../../../db/index");
const moment = require("moment-timezone");
const logger = require("../../../../../config/logger");

// 검수 작업이 일정시간동안 제출되지 않으면
const timeout = async data_id => {
  const sql = `update data set schedule_state='queued' where id = $1`;
  const result = await db
    .query(sql, [data_id])
    .then(res => console.log("검수 작업 타임아웃"))
    .catch(err => {
      logger.error(err);
    });
};

// 타이머를 저장하는 오브젝트
const timerObject = {};

// path: ~/api/mypage/creator/task/inspection
// 검수 큐에 있는 data를 시간이 빠른 순서대로 불러온다
// 자신이 한번도 참여하지 않았고 상태가 'queued'인 data를 불러온다
// 그리고 해당 data의 상태를 'reserved' 로 변경한다
// 그리하여 다른 검수 작업자가 해당 data에 접근하지 못 하게 한다
router.get("/", (req, res, next) => {
  const project_id = req.query.project_id;
  console.log(project_id);
  const production_sql = `begin;
  lock table data in exclusive mode;
  update data 
  set schedule_state='reserved' 
  where id in (
    select 
      id from data 
    where 
      status='created'
      and
      schedule_state='queued' 
      and 
      '${req.user.id}' != ALL(inspector)
      and
      project_id='${project_id}'
    order by 
      created_at asc 
    limit 1 
  )
  returning *;
  commit;`;

  // const debug_sql = `
  //   select * from data order by created_at asc limit 1
  // `;
  db.query(production_sql, [], (err, result) => {
    if (err) {
      logger.error(err);
      return res.status(500).send(err);
    }

    if (result[2].rows.length === 0) {
      return res.json({
        message: "참여 가능한 검수 작업이 존재하지 않습니다"
      });
    }

    // 하나의 유저별로 타이머를 할당한다
    // 하나의 작업 당 제한시간은 5분이다
    const data_id = result[2].rows[0].id;
    const timer = setTimeout(() => {
      timeout(data_id);
    }, 300000);
    timerObject[req.user.id] = timer;
    return res.json({ result: result[2].rows[0] });
  });
});
// 작업 완료 요청 핸들링
// reserved 상태 였던 data를 다시 queue로 되돌린다
/**
 * @dev new_crop_image 필드를 받아서 data의 payload 부분을 업데이트 해준다
 */
router.post("/", async (req, res, next) => {
  // 타이머를 초기화해준다
  clearTimeout(timerObject[req.user.id]);

  const data = req.body;
  console.log("data: ", data);

  const new_crop_image = JSON.stringify(data.new_crop_image);
  const data_id = data.data_id;
  // data 테이블에 주어진 id의 data를 업데이트 시킨다
  const updated_data = await db
    .query(
      `
    update data
    set schedule_state='queued', inspector = array_append(inspector, '${req.user.id}'),
    payload = jsonb_set(payload, '{meta, crop_image}', jsonb '${new_crop_image}', true)
    where id='${data_id}' returning *;
    `,
      []
    )
    .then(res => res.rows[0])
    .catch(err => {
      logger.error(err);
      return res.status(500).send(err);
    });
  // inspector_pool 에 검수자의 id와 data의 id를 추가한다
  const inspector_update_query = `insert into inspector_pool values($1, $2, $3)`;
  await db
    .query(inspector_update_query, [
      req.user.id,
      data_id,
      moment()
        .tz("Asia/Seoul")
        .format()
    ])
    .then(res => res.rows)
    .catch(err => {
      logger.error(err);
      return res.status(500).send(err);
    });

  console.log("updated_data: ", updated_data);
  const inspectors = updated_data.inspector;
  console.log("inspectors: ", inspectors);
  // 검수를 더 진행해야 된다면 그냥 true를 반환한다
  if (inspectors.length < updated_data.inspector_count)
    return res.json({ result: true });

  // 검수자 수가 inspector_count 와 같다면
  // 검수가 종료된 것으로 검수 결과를 확인해야 한다
  // correct 필드를 검사하여 data의 status를 변경해준다
  const crop_image = updated_data.payload.meta.crop_image;
  let inspection_result = []; // 검수 결과 저장
  let status; // 데이터의 최종 상태
  // 검수자들의 reliability를 가져온다
  const inspector_reliability_promises = await inspectors.map(
    async inspector => {
      const inspector_id = inspector;
      const sql = "select reliability from data_creator where id = $1";
      const inspector_reliability = await db
        .query(sql, [inspector_id])
        .then(res => res.rows[0].reliability)
        .catch(err => {
          logger.error(err);
          return res.status(500).send(err);
        });
      console.log(
        `reliability of inspector ${inspector_id}: `,
        inspector_reliability
      );
      return new Promise(resolve => resolve(inspector_reliability));
    }
  );
  const inspector_reliabilities = await Promise.all(
    inspector_reliability_promises
  );
  console.log("inspector_reliabilities: ", inspector_reliabilities);

  // 이미지의 각 crop 영역에 대해
  let crop_promises = await crop_image.map(async (crop, index) => {
    let correct_prob = 1; // correct 확률
    let incorrect_prob = 1; // incorrect 확률
    // 검수자들의 각 검수 결과를 순회한다
    let correct_promises = await crop.correct.map(async (is_correct, index) => {
      const inspector_reliability = inspector_reliabilities[index];

      if (Number(is_correct) === 1) {
        // 숫자가 커지는 것을 막기 위해 100 으로 나눠서 확률을 계산한다
        correct_prob *= Number(inspector_reliability) / 100;
        incorrect_prob *= 1 - Number(inspector_reliability) / 100;
      } else {
        correct_prob *= 1 - Number(inspector_reliability) / 100;
        incorrect_prob *= Number(inspector_reliability) / 100;
      }

      return new Promise(resolve => resolve(true));
    });
    correct_promises = await Promise.all(correct_promises);

    // 계산된 correct 확률을 비교한다
    // 만약 correct 확률의 비율이 0.5 이상이라면 이는 통과
    // 그렇지 않으면 반려시킨다
    console.log("# index : ", index);
    console.log("crop label: ", crop_image[index].region_attributes.label);
    console.log("correct_prob: ", correct_prob);
    console.log("incorrect_prob: ", incorrect_prob);
    correct_prob / (correct_prob + incorrect_prob) > 0.5
      ? inspection_result.push("done")
      : inspection_result.push("failure");
    return new Promise(resolve => resolve(true));
  });

  crop_promises = await Promise.all(crop_promises);
  // inspection_result 에는 각 crop의 검수 결과를 저장하고 있다
  // 만약 하나라도 failure이 존재한다면 data를 반려시킨다
  console.log("inspection_result: ", inspection_result);
  inspection_result.includes("failure")
    ? (status = "failure")
    : (status = "done");
  // DB에 저장된 data의 상태를 update 시킨다
  const sql = `update data set status = $1 where id = $2`;
  db.query(sql, [status, data_id], (err, result) => {
    if (err) {
      logger.error(err);
      return res.status(500).send(err);
    }
    return res.json({ result: true });
  });
});

module.exports = router;
