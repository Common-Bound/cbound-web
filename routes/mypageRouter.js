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

// 내가 참여 가능한 프로젝트 목록들을 보여준다
router.get("/", (req, res, next) => {
  const sql = "select * from project";
  db.query(sql, [], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    if (result.rows.length > 0) {
      return res.json({ result: result.rows });
    } else {
      return res.json({ message: "프로젝트가 존재하지 않습니다" });
    }
  });
});

module.exports = router;
