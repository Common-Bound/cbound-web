const express = require("express");
const router = express.Router();
const db = require("../../../db/index");
const moment = require("moment");
require("moment-timezone");
const logger = require("../../../config/logger");

// path: ~/mypage/creator/projects
// 내가 참여한 프로젝트 목록을 반환한다
router.get("/", (req, res, next) => {
  if (req.user) {
    const user_id = req.user.id;
    db.query(
      "select * from creator_pool as c join project as p on c.project_id=p.id where c.creator_id=$1",
      [user_id],
      (err, result) => {
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

          if (available_projects.length > 0)
            return res.json({ result: available_projects });
          else {
            return res.json({ message: "참여한 프로젝트가 존재하지 않습니다" });
          }
        }
      }
    );
  }
});

module.exports = router;
