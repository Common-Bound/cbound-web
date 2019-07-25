const express = require("express");
const router = express.Router();
const projectRouter = require("./mypage/projects");
const db = require("../db/index");

// path: ~/mypage
// 사용자 로그인 여부 검사
const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ result: false });
  } else next();
};
router.use(isAuthenticated);

router.use("/projects", projectRouter);

// 사용자의 세션을 검사한다
router.get("/", (req, res, next) => {
  console.log("/mypage 라우터 도달");

  console.log("요청자 세션 : ", req.user);
  // 요청자의 세션이 서버에 존재한다면, true를 반환해준다
  if (req.user) {
    return res.json({ result: true });
  } else return res.status(401).json({ result: false });
});

module.exports = router;
