const express = require("express");
const router = express.Router();
const mainRouter = require("./mypage/main");

// path: ~/mypage
router.use("/", (req, res, next) => {
  console.log("/mypage 라우터 도달");
  next();
});
router.use("/main", mainRouter);

module.exports = router;
