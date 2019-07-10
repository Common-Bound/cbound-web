const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("로그아웃 전 user 세션: ", req.user);
  req.logOut();
  console.log("로그아웃 후 user 세션: ", req.user);
  console.log("로그아웃...");
  res.json({ result: true });
});

module.exports = router;
