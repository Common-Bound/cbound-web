const express = require("express");
const router = express.Router();
const joinRouter = require("./creator/join");
const projectsRouter = require("./creator/projects");
const taskRouter = require("./creator/taskRouter");
const historyRouter = require("./creator/history");
const logger = require("../../../config/logger");

const db = require("../../../db/index");
const moment = require("moment");
require("moment-timezone");

// path: ~/api/mypage/creator
router.use("/join", joinRouter);
router.use("/projects", projectsRouter);
router.use("/task", taskRouter);
router.use("/history", historyRouter);

// 내가 참여 가능한 프로젝트 목록들을 보여준다
router.get("/", (req, res, next) => {
  const sql = "select * from project";
  db.query(sql, [], (err, result) => {
    if (err) {
      logger.error(err);
      return res.status(500).send(err);
    }
    if (result.rows.length > 0) {
      const available_projects = result.rows.filter(row => {
        const now = moment().tz("Asia/Seoul");
        const due_date = moment(row.due_date);
        const millisec_diff = moment

          .duration(due_date.diff(now))
          .asMilliseconds();
        if (millisec_diff > 0) return row;
      });

      if (available_projects.length > 0) {
        return res.json({ result: available_projects });
      } else {
        return res.json({ message: "프로젝트가 존재하지 않습니다" });
      }
    } else {
      return res.json({ message: "프로젝트가 존재하지 않습니다" });
    }
  });
});

router.get("/point", (req, res, next) => {
  const user_id = req.user.id;
  const sql = "select id, email, point from data_creator where id = $1";
  db.query(sql, [user_id], (err, result) => {
    if (err) {
      logger.error(err);
      return res.status(500).send(err);
    }
    const info = result.rows;
    if (info.length > 0) {
      return res.json({ result: info[0] });
    } else {
      return res.json({
        message: "해당 아이디를 가진 유저가 존재하지 않습니다."
      });
    }
  });
});

module.exports = router;
