const express = require("express");
const router = express.Router();

// path: ~/mypage/projects
router.get("/", (req, res, next) => {
  res.json({ msg: "본인이 프로젝트 목록입니당 뿅" });
});

module.exports = router;
