const express = require("express");
const router = express.Router();
const completeRouter = require("./normal/complete");
const textRouter = require("./normal/text");
const objectRouter = require("./normal/object");

router.use("/text", textRouter);
router.use("/object", objectRouter);
router.use("/complete", completeRouter);

// path: ~/api/mypage/creator/task/normal
// 파일 최초 업로드 요청 핸들링

module.exports = router;
