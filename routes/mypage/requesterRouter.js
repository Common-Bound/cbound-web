const express = require("express");
const router = express.Router();
const db = require("../../db/index");
const createRouter = require("./requester/create");
const insightRouter = require("./requester/insight");
// path: ~/mypage/requester

router.use("/create", createRouter);
router.use("/insight", insightRouter);

// 내가 생성한 프로젝트 목록들을 보여준다
router.get("/", (req, res, next) => {
  const user_id = req.user.id;
  const sql =
    "select * from project where id in (select project_id from requester_pool where requester_id = $1)";
  console.log(sql);
  db.query(sql, [user_id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    if (result.rows.length > 0) {
      const requested_projects = result.rows;

      if (requested_projects.length > 0) {
        // 검수 프로젝트는 제외한다
        requested_normal_projects = requested_projects.filter(
          project => project.project_type === "normal"
        );
        return res.json({ result: requested_normal_projects });
      } else {
        return res.json({ message: "개설한 프로젝트가 존재하지 않습니다" });
      }
    }
  });
});

module.exports = router;
