const express = require("express");
const router = express.Router();
const creatorRouter = require("./mypage/creatorRouter");
const requesterRouter = require("./mypage/requesterRouter");

// path: ~/api/mypage
// 사용자 로그인 여부 검사
const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ result: false });
  } else next();
};
router.use(isAuthenticated);

// 사용자 라우터
router.use("/creator", creatorRouter);
router.use("/requester", requesterRouter);

module.exports = router;
