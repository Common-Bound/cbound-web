const express = require("express");
const router = express.Router();
const db = require("../db/index");
const uuid = require("uuid/v4");

// path: ~/projects
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

  db.query(
    "insert into project values($1, $2)",
    [id, titles[title_index]],
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
