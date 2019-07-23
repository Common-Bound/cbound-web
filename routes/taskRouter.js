const express = require("express");
const router = express.Router();

// path: ~/task
router.post("/", (req, res, next) => {
  console.log("/task 라우터 도착");
  console.log(req.body);
});

module.exports = router;
