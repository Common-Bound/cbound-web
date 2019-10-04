const express = require("express");
const router = express.Router();
const authRouter = require("./api/authRouter");
const mypageRouter = require("./api/mypageRouter");

// path: ~/api
router.use("/", (req, res, next) => {
  console.log("/api 도착");
  next();
});
router.use("/auth", authRouter);
router.use("/mypage", mypageRouter);

module.exports = router;
