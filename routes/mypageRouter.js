const express = require("express");
const router = express.Router();
const projectRouter = require("./mypage/projects");
const joinRouter = require('./mypage/join');
const db = require("../db/index");
const uuid = require('uuid/v4');

// path: ~/mypage
// 사용자 로그인 여부 검사
const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ result: false });
  } else next();
};
router.use(isAuthenticated);

router.use('/join', joinRouter);
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

// 프로젝트 생성 요청 핸들링
router.post("/", (req, res, next) => {
  const id = uuid();
  const titles = [
    "얼굴 사진 찍기",
    "음식 사진 찍기",
    "강아지 사진 바운딩",
    "실내 가구 바운딩"
  ];
  const title_index = Math.floor(Math.random() * 4);
  const reward = Math.floor(Math.random() * 500);
  const date = new Date();

  // project 테이블에 project 를 추가한다
  // project 속성
  // id, title, image, simple_desc, detail_desc,
  // due_date, created_at, type, guideline_url, reward
  db.query(
    "insert into project values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
    [id, titles[title_index], null, '간단한 설명', '자세한 설명 입니다',
      '무기한', date, 'image', null, reward],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      return res.json({ result: true });
    }
  );
});

module.exports = router;
