const express = require("express");
const router = express.Router();
const uuid = require("uuid/v4");
const axios = require("axios");
const multer = require("multer");
const memory = multer.memoryStorage();

const completeRouter = require('./task/complete');

router.use("/", (req, res, next) => {
  console.log("/task 라우터 도착");
  next();
});

/* 사용자 로그인 여부 검사 모듈 */
const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: '로그인 해주세요' });
  } else next();
};

router.use(isAuthenticated);
router.use('/complete', completeRouter);

// 서버의 메모리에 올리는 모듈
const upload_mem = multer({
  storage: memory
});

/* 파일 로깅 모듈 */
const fileLogger = (req, res, next) => {
  const file = req.file;
  console.log('========== 전달 받은 파일 정보 ==========');
  console.log(file);
  console.log('=====================================');
  next();
}

// path: ~/task
// 파일 최초 업로드 요청 핸들링
router.post("/", upload_mem.single("orig_image"), fileLogger, (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: "파일을 전달받지 못 했습니다" });
  }

  const file = req.file;
  const id = uuid();
  const url =
    "http://ec2-13-209-99-40.ap-northeast-2.compute.amazonaws.com:8080/ocr/api/";
  /*axios
    .post(url, {
      id: id,
      method: "post",
      orig_image: file,
      meta: meta
    })
    .then(res => res.data)
    .then(data => {
      console.log(data);
      return res.json({ data: data });
    })
    .catch(err => {
      console.log(err);
      return res.json(500).json({ error: err });
    });*/
});

module.exports = router;
