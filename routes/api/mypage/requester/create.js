const express = require("express");
const router = express.Router();
const db = require("../../../../db/index");
const uuid = require("uuid/v4");
const moment = require("moment");
require("moment-timezone");
const logger = require("../../../../config/logger");

// path: ~/api/mypage/requester/create
router.post("/", (req, res, next) => {
  console.log(req.body);
  if (!req.user) {
    return res.status(401).json({ message: "로그인 해주세요" });
  }
  const normal_id = uuid();
  const inspection_id = uuid();
  const user_id = req.user.id;

  var created_at = moment()
    .tz("Asia/Seoul")
    .format();
  var due_date = moment(req.body.due_date)
    .tz("Asia/Seoul")
    .format();
  // id, ref_project, title, title_image, simple_description, detail_description,
  // due_date, created_at, type, project_type, guideline_url, reward

  db.query(
    "insert into project values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
    [
      normal_id,
      null,
      req.body.title,
      req.body.title_image,
      req.body.simple_description,
      req.body.detail_description,
      due_date,
      created_at,
      req.body.type,
      "normal",
      req.body.guideline_url,
      req.body.reward
    ],
    (err, result) => {
      if (err) {
        logger.error(err);
        return res.status(500).send(err);
      }
      // 검수 프로젝트 추가
      db.query(
        "insert into project values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
        [
          inspection_id,
          normal_id,
          req.body.title,
          req.body.title_image,
          req.body.simple_description,
          req.body.detail_description,
          due_date,
          created_at,
          req.body.type,
          "inspection",
          req.body.guideline_url,
          req.body.reward
        ],
        (err, result) => {
          if (err) {
            logger.error(err);
            return res.status(500).send(err);
          }
          db.query(
            "insert into requester_pool values($1, $2)",
            [normal_id, user_id],
            (err, result) => {
              if (err) {
                logger.error(err);
                return res.status(500).send(err);
              }
              db.query(
                "insert into requester_pool values($1, $2)",
                [inspection_id, user_id],
                (err, result) => {
                  if (err) {
                    logger.error(err);
                    return res.status(500).send(err);
                  }
                  return res.json({ result: true });
                }
              );
            }
          );
        }
      );
    }
  );
});

module.exports = router;
