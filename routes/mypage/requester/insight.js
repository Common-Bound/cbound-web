const express = require("express");
const router = express.Router();
const db = require("../../../db/index");
const moment = require("moment");
const logger = require("../../../config/logger");

// path: ~/mypage/requester/insight
router.get("/:project_id", (req, res, next) => {
  // 주어진 project_id 와 관련된 데이터를 가져온다
  const project_id = req.params.project_id;

  // project_id 가 주어진 project_id 와 동일한 data를 모두 가져온다
  const sql = "select * from data where project_id = $1";
  db.query(sql, [project_id], (err, result) => {
    if (err) {
      logger.error(err);
      return res.status(500).send(err);
    }
    const datas = result.rows;

    const total_count = datas.length; // 생산된 총 데이터 수
    const now_day = moment().day(); // 현재 요일 (0: 일요일, 1: 월요일, ... 6: 토요일)
    const today_count = datas.filter(data => {
      // 오늘 생산된 총 데이터 수
      return Number(moment(data.created_at).day()) === Number(now_day);
    }).length;
    // 참여자 수
    const creator_count = new Set(datas.map(data => data.creator_id)).size;
    console.log("creator_count: ", creator_count);
    // 검수된 데이터 수
    const inspected_count = datas.filter(data => data.status === "done").length;

    return res.json({
      result: {
        total_count: total_count,
        today_count: today_count,
        creator_count: creator_count,
        inspected_count: inspected_count
      }
    });
  });
});

module.exports = router;
