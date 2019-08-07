const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const multer = require("multer");
const multerS3 = require("multer-s3");
const uuid = require('uuid/v4');
const db = require('../../../db/index');

// AWS config 파일 불러오기
AWS.config.loadFromPath(__dirname + "/../../../config/awsConfig.json");
let s3 = new AWS.S3();

// S3에 올리는 모듈
const upload_s3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: "task-data-bucket",
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + ' ' + file.originalname);
        },
        acl: "public-read-write"
    })
});

/* 파일 로깅 모듈 */
const fileLogger = (req, res, next) => {
    const file = req.file;
    console.log('========== 전달 받은 파일 정보 ==========');
    console.log(file);
    console.log('=====================================');
    next();
}

// path: ~/mypage/task/complete
// 작업을 최종 제출하는 요청 핸들링
// s3 에 업로드한 후 해당 URL과 크롭한 이미지 정보를 DB에 함께 저장한다
router.post("/", upload_s3.single("orig_image"), fileLogger, (req, res, next) => {
    const user_id = req.user.id;
    const meta = req.body.meta; // { crop_image: [ {x: 0, y: 0, ... }, {}, ... ]}
    console.log('meta: ');
    console.log(meta);
    const id = uuid();
    const date = Date();
    const file = req.file;
    const project_id = req.body.project_id;

    const payload = {
        orig_image: file.location,
        meta: meta
    }
    // id, type, payload(json), created_at, status,
    // creator_id, correct, incorrect, project_id
    db.query(
        "insert into data values($1, $2, $3, $4, $5, $6, $7, $8, $9)",
        [id, "image", payload, date, "created", user_id, 0, 0, project_id],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            return res.json({ result: true });
        }
    );
});

module.exports = router;