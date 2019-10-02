const express = require("express");
const router = express.Router();
const normalRouter = require("./task/normalRouter");
const inspectionRouter = require("./task/inspectionRouter");

// path: ~/mypage/creator/task
/* 사용자 로그인 여부 검사 모듈 */
router.use("/normal", normalRouter);
router.use("/inspection", inspectionRouter);

module.exports = router;
