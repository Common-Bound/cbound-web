const express = require("express");
const router = express.Router();
const db = require("../../db/index");
// path: ~/mypage/requester

// 내가 생성한 프로젝트 목록들을 보여준다
router.get("/", (req, res, next) => {
  const sql =
    "select * from project where id in (select project_id from requester_pool where requester_id = '" +
    req.user.id +
    "')";
  console.log(sql);
  db.query(sql, [], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    if (result.rows.length > 0) {
      const requested_projects = result.rows;

      if (requested_projects.length > 0) {
        return res.json({ result: requested_projects });
      } else {
        return res.json({ message: "프로젝트가 존재하지 않습니다" });
      }
    }
  });

  router.get("/chartData", (req, rews, next) => {
    const sql = "";
  });
});

module.exports = router;
