const express = require("express");
const router = express.Router();

const normalRouter = require("./task/normalRouter");
const inspectionRouter = require("./task/inspectionRouter");

// path: ~/mypage/creator/task
router.use("/", (req, res, next) => {
  console.log("/task 라우터 도착");
  next();
});

/* 사용자 로그인 여부 검사 모듈 */
const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "로그인 해주세요" });
  } else next();
};

router.use(isAuthenticated);
router.use("/normal", normalRouter);
router.use("/inspection", inspectionRouter);

module.exports = router;
