const express = require("express");
const router = express.Router();
const db = require("../../../../db/index");
const moment = require("moment");
const logger = require("../../../../config/logger");

// path: ~/api/mypage/creator/history
router.get("/", async (req, res, next) => {
  // 자신이 생성한 데이터 목록을 가져온다
  // 이 때 프로젝트 정보도 함께 가져오기 위해 join 된 결과를 가져온다
  // data.created_at(date), title, reward, status, project_type 정보를 가져온다
  const sql1 = `select data.created_at as date, status, title, reward, project_type from data join project on data.project_id = project.id where creator_id = $1;`;
  const created_data = await db
    .query(sql1, [req.user.id])
    .then(res => res.rows)
    .catch(err => {
      logger.error(err);
      return res.status(500).send(err);
    });
  // 최근 30일간 생성한 data만을 가져온다
  const created_data_in_30_days = await created_data
    .filter(data => moment().diff(data.created_at, "days") < 30)
    .map(data => new Promise(resolve => resolve(data)));
  // 자신이 검수한 데이터 목록을 가져온다
  // inspected_at(date), title, reward 정보를 가져온다
  const sql2 = `select inspected_at as date, title, reward from inspector_pool 
  join data 
  on inspector_pool.data_id = data.id
  join project
  on data.project_id = project.id
  where inspector_pool.inspector_id = $1;`;
  const inspected_data = await db
    .query(sql2, [req.user.id])
    .then(res => res.rows)
    .catch(err => {
      logger.error(err);
      return res.status(500).send(err);
    });
  // 최근 30일간 검수한 데이터만을 가져온다
  const inspected_data_in_30_days = await inspected_data
    .filter(data => moment().diff(data.inspected_at, "days") < 30)
    .map(data => new Promise(resolve => resolve(data)));

  // 가져온 정보들을 하나의 배열로 묶어서 시간 순으로 정렬한다
  let total_data = created_data_in_30_days.concat(inspected_data_in_30_days);
  total_data.sort(function(obj1, obj2) {
    return moment(obj1.date).millisecond() - moment(obj2.date).millisecond();
  });
  total_data = await Promise.all(total_data);
  console.log("total_data: ", total_data);

  return res.status(200).json({ result: total_data });
});

module.exports = router;
