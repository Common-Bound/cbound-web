const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res, next) => {
  const { rows } = await db.query("select * from test_user", []);
  console.log(rows);
  res.send(rows);
});

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  const { rows } = await db.query("select * from test_user where id = $1", [
    id
  ]);
  console.log(rows);
  res.send(rows[0]);
});

/* 사용자 생성 요청 처리 */
router.post("/", (req, res, next) => {
  const body = req.body;
  console.log(body);
  res.json({ msg: "서버가 사용자 생성 요청을 정상 처리하였음" });
});

module.exports = router;
