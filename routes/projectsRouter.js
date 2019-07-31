const express = require("express");
const router = express.Router();
const db = require("../db/index");
const uuid = require("uuid/v4");

// path: ~/projects
router.use("/", (req, res, next) => {
  console.log("/projects 라우터 도착");
  next();
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

// 프로젝트 참여 요청 핸들링
router.post("/join", (req, res, next) => {
  console.log(req.user);
  if (req.user) {
    const user_id = req.user.id;
    const proj_id = req.body.proj_id;
    db.query(
      "insert into creator_pool values($1, $2)",
      [proj_id, user_id],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        return res.json({ result: true });
      }
    );
  } else {
    return res.status(401).json({ result: false });
  }
});

module.exports = router;
