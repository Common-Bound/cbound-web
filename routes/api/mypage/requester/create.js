const express = require("express");
const router = express.Router();
const db = require("../../../../db/index");
const uuid = require("uuid/v4");
const moment = require("moment");
require("moment-timezone");
const logger = require("../../../../config/logger");
const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

// AWS config 파일 불러오기
// AWS.config.loadFromPath(__dirname + "/../../../../config/awsConfig.json");
AWS.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: "ap-northeast-2"
});
let s3 = new AWS.S3();

// S3에 올리는 모듈
const upload_s3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: "proj-data-bucket",
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      cb(null, `${req.user.id}/${Date.now().toString()}-${file.originalname}`);
    },
    acl: "public-read-write"
  })
});

/* 파일 로깅 모듈 */
const fileLogger = (req, res, next) => {
  const file = req.file;
  console.log("========== 전달 받은 파일 정보 ==========");
  console.log(file);
  console.log("=====================================");
  next();
};

// path: ~/api/mypage/requester/create
router.post(
  "/",
  upload_s3.single("title_image"),
  fileLogger,
  (req, res, next) => {
    console.log(req.body);
    if (!req.user) {
      return res.status(401).json({ message: "로그인 해주세요" });
    }
    const normal_id = uuid();
    const inspection_id = uuid();
    const info = JSON.parse(req.body.info);
    const user_id = req.user.id;
    const title_image = req.file.location;
    const classes = info.class;

    var created_at = moment()
      .tz("Asia/Seoul")
      .format();
    var due_date = moment(info.due_date)
      .tz("Asia/Seoul")
      .format();
    // id, ref_project, title, title_image, simple_description, detail_description,
    // due_date, created_at, type, project_type, guideline_url, reward, class

    db.query(
      "insert into project values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
      [
        normal_id,
        null,
        info.title,
        title_image,
        info.simple_description,
        info.detail_description,
        due_date,
        created_at,
        info.type,
        "normal",
        null, //info.guideline_url,
        info.reward,
        classes
      ],
      (err, result) => {
        if (err) {
          logger.error(err);
          return res.status(500).send(err);
        }
        // 검수 프로젝트 추가
        db.query(
          "insert into project values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
          [
            inspection_id,
            normal_id,
            info.title,
            title_image,
            info.simple_description,
            info.detail_description,
            due_date,
            created_at,
            info.type,
            "inspection",
            info.guideline_url,
            info.reward,
            classes
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
  }
);

module.exports = router;
