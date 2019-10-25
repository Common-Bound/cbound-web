const express = require("express");
const router = express.Router();
const normalRouter = require("./page/normal");
const inspectRouter = require("./page/inspect");

// path: ~/mypage/creator/history/page
router.use("/normal", normalRouter);
router.use("/inspection", inspectRouter);

module.exports = router;
