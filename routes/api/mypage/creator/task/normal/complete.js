const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const uuid = require("uuid/v4");
const db = require("../../../../../../db/index");
const moment = require("moment-timezone");
const logger = require("../../../../../../config/logger");

// AWS config 파일 불러오기
// AWS.config.loadFromPath(__dirname + "/../../../../../../config/awsConfig.json");
AWS.config.update({
  secretAccessKey: process.env.CLOUDCUBE_SECRET_ACCESS_KEY,
  accessKeyId: process.env.CLOUDCUBE_ACCESS_KEY_ID,
  region: "us-east-1"
});
let s3 = new AWS.S3();

// S3에 올리는 모듈
const upload_s3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: "cloud-cube",
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      cb(
        null,
        `rspayzankl2p/public/task-data-bucket/${req.body.title}_${
          req.body.project_id
        }/${req.user.id}/${Date.now().toString()}-${file.originalname}`
      );
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

// path: ~/api/mypage/creator/task/normal/complete
// 작업을 최종 제출하는 요청 핸들링
// s3 에 업로드한 후 해당 URL과 크롭한 이미지 정보를 DB에 함께 저장한다
router.post(
  "/",
  upload_s3.single("orig_image"),
  fileLogger,
  (req, res, next) => {
    const user_id = req.user.id;
    let meta = JSON.parse(req.body.meta);
    let ai_total_size = Number(req.body.ai_total_size);
    let crop_image = meta.crop_image; // [ {x: 0, y: 0, ... }, {}, ... ]
    let total_size = 0;
    // let total_width = 0;
    // let total_height = 0;
    new_crop_image = crop_image.map(crop => {
      crop.correct = []; // detection된 영역의 O(1), X(0) 여부 검사한 값이 들어가는 필드. 검수자에 의해 수정됨
      crop.shape_attributes.size =
        crop.shape_attributes.width * crop.shape_attributes.height;
      total_size += crop.shape_attributes.size;

      // total_width += Number(crop.shape_attributes.width);
      // total_height += Number(crop.shape_attributes.height);

      return crop;
    });
    meta.crop_image = new_crop_image;
    // meta.total_width = total_width;
    // meta.total_height = total_height;
    meta.total_size = total_size;
    meta.ai_total_size = ai_total_size;
    meta.compare_size = ai_total_size != 0 ? total_size / ai_total_size : 0;
    const id = uuid();
    const date = moment()
      .tz("Asia/Seoul")
      .format();
    const file = req.file;
    const project_id = req.body.project_id;
    const schedule_state = project_id === "undefined" ? "reserved" : "queued";

    const payload = {
      orig_image: file.location,
      meta: meta
    };
    const reliability = 0;
    const inspector_count = 1;
    // console.log("payload: ");
    // console.log(payload);
    // id, type, payload(json), created_at, status,
    // creator_id, inspector, project_id, schedule_state, reliability, inspector_count
    db.query(
      "insert into data values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
      [
        id,
        "image",
        payload,
        date,
        "created",
        user_id,
        [],
        project_id,
        schedule_state,
        reliability,
        inspector_count
      ],
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

module.exports = router;
