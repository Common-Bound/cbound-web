const express = require('express');
const router = express.Router();
const uuid = require("uuid/v4");
const axios = require("axios");
const multer = require('multer');
const memory = multer.memoryStorage();

const completeRouter = require('./normal/complete');

const upload_mem = multer({
  storage: memory,
  limits: { fieldSize: 25 * 1024 * 1024 }
})

router.use('/complete', completeRouter);

// path: ~/mypage/task/normal
// 파일 최초 업로드 요청 핸들링
router.post("/", upload_mem.single('orig_image'), (req, res, next) => {

  const imageSrc = req.body.orig_image;
  console.log(req.body);
  const id = uuid();
  const url =
    "http://ec2-54-180-87-68.ap-northeast-2.compute.amazonaws.com:8080/ocr/detection/";
  axios
    .post(url, {
      id: id,
      method: "post",
      orig_image: imageSrc
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

module.exports = router;