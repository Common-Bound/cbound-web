const express = require("express");
const router = express.Router();
const db = require("../../../db/index");
const uuid = require("uuid/v4");
const moment = require("moment");

// path: ~/mypage/requester/insight
router.get("/:project_id", (req, res, next) => {
  // 주어진 project_id 와 관련된 데이터를 가져온다
  const project_id = req.params.project_id;

  // project_id 가 주어진 project_id 와 동일한 data를 모두 가져온다
  const sql = "select * from data where project_id = $1";
  db.query(sql, [project_id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    const datas = result.rows;

    const total_count = datas.length;
    const now_day = moment().day(); // 현재 요일 (0: 일요일, 1: 월요일, ... 6: 토요일)
    console.log("now day: ", now_day);
    // datas.forEach(data => {
    //   const created_day = Date(data.created_at);
    //   console.log(created_day);
    //   console.log(moment(created_day).day());
    // });

    const today_count = datas.filter(data => {
      return Number(moment(data.created_at).day()) === Number(now_day);
    }).length;
    console.log("today_count: ", today_count);
    return res.json({
      result: {
        total_count: total_count,
        today_count: today_count
      }
    });
  });
});

module.exports = router;
