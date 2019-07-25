const express = require("express");
const router = express.Router();
const db = require("../db/index");
const uuid = require("uuid/v4");
const axios = require("axios");
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const memory = multer.memoryStorage();

// AWS config 파일 불러오기
/*AWS.config.loadFromPath(__dirname + "/../config/awsConfig.json");
let s3 = new AWS.S3();*/;

// 서버의 메모리에 올리는 모듈
const upload_mem = multer({
  storage: memory
});

// S3에 올리는 모듈
/*const upload_s3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: "task-data-bucket",
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      cb(null, Date.now().toString() + req.user.email);
    },
    acl: "public-read-write"
  })
});*/

// path: ~/task
// 사용자 로그인 여부 검사
const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ result: false });
  } else next();
};

router.use(isAuthenticated);

// 파일 최초 업로드 요청 핸들링
router.post("/", upload_mem.single("imgFile"), (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: "파일을 전달받지 못 했습니다" });
  }

  const file = req.file;
  console.log(file);
  const id = uuid();
  const url =
    "http://ec2-13-209-99-40.ap-northeast-2.compute.amazonaws.com:8080/ocr/test1/";
  axios
    .post(url, {
      id: id,
      method: "post",
      orig_image: file
    })
    .then(res => res.data)
    .then(data => {
      console.log(data);
      return res.json({ data: data });
    })
    .catch(err => {
      console.log(err);
      return res.json(500).json({ error: err });
    });
});

// 작업을 최종 제출하는 요청 핸들링
router.post("/complete", /*upload_s3.single("imgFile"),*/ (req, res, next) => {
  const user_id = req.user.id;
  const body = req.body;
  const id = uuid();
  const date = Date();
  // id, type, payload(json), created_at, status,
  // creator_id, ck1_id, ck2_id, project_id
  /*db.query(
    "insert into data values($1, $2, $3, $4, $5, $6, $7, $8, $9)",
    [id, "image", body, date, "created", user_id, null, null, null],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      return res.json({ result: true });
    }
  );*/
  return res.json({ result: true });
});

module.exports = router;
