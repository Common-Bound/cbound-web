const express = require("express");
const router = express.Router();
const db = require("../../../db/index");

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
          console.log(err);
          return res.status(500).send(err);
        } else return res.json({ result: result.rows });
      }
    );
  }
});

module.exports = router;
