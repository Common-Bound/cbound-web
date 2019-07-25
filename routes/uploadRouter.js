const express = require("express");
const router = express.Router();
const multer = require("multer");
const memory = multer.memoryStorage();
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

// AWS config 파일 불러오기
AWS.config.loadFromPath(__dirname + "/../config/awsConfig.json");
let s3 = new AWS.S3();

// 서버의 메모리에 올리는 모듈
const upload_mem = multer({
  storage: memory
});

// S3에 올리는 모듈
const upload_s3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: "task-data-bucket",
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      cb(null, Date.now().toString());
    },
    acl: "public-read-write"
  })
});

const upload = multer({
  //dest: "upload/"
  storage: memory
});

// path: ~/upload
router.post("/", upload_s3.single("imgFile"), (req, res, next) => {
  console.log("upload 라우터 도착");
  console.log(req.body);

  console.log(req.file);
  console.log(req.body.json);
  return res.json({ result: true });
});

module.exports = router;
