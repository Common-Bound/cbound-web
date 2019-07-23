const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const db = require("../db/index");
const uuid = require("uuid/v4");

router.post("/", (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ result: false });
  }
});

router.post("/complete", (req, res, next) => {
  // 유저 로그인 여부 검사
  if (!req.user) {
    return res.status(401).json({ result: false });
  }

  const user_id = req.user.id;
  const body = req.body;
  const id = uuid();
  const date = Date();
  // id, type, payload(json), created_at, status,
  // creator_id, ck1_id, ck2_id, project_id
  db.query(
    "insert into data values($1, $2, $3, $4, $5, $6, $7, $8, $9)",
    [id, "image", body, date, "created", user_id, null, null, null],
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
