const express = require("express");
const router = express.Router();

// path: ~/mypage/task/insection
router.use("/", (req, res, next) => {
  console.log("/inspection 라우터 도착");
  next();
});


module.exports = router;
