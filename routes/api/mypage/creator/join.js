const express = require("express");
const router = express.Router();
const db = require("../../../../db/index");
const logger = require("../../../../config/logger");

// path: ~/api/mypage/creator/join
// 프로젝트 참여 요청 핸들링
router.post("/", (req, res, next) => {
  const user_id = req.user.id;
  const proj_id = req.body.proj_id;
  // 이미 참여한 이력이 있는지 확인
  db.query(
    "select * from creator_pool where creator_id=($1) and project_id=($2)",
    [user_id, proj_id],
    (err, result) => {
      if (err) {
        logger.error(err);
        return res.status(500).send(err);
      }
      // result.rows가 존재한다면 참여 이력이 있는 것임
      // 이 경우 참여를 허용하지 않는다
      if (result.rows.length > 0) {
        return res.json({ message: "이미 참여한 프로젝트 입니다" });
      } else {
        // 참여 이력이 없는 경우 creator_pool 에 해당 유저 id 와 프로젝트 id 를 추가한다
        db.query(
          "insert into creator_pool values($1, $2)",
          [proj_id, user_id],
          (err, result) => {
            if (err) {
              logger.error(err);
              return res.status(500).send(err);
            }
            return res.json({ result: true });
          }
        );
      }
    }
  );
});

module.exports = router;
