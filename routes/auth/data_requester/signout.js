const express = require("express");
const logger = require("../../../config/logger");
const router = express.Router();

router.get("/", (req, res, next) => {
  logger.info("로그아웃 user: " + req.user.id);
  req.logOut();
  res.json({ result: true });
});

module.exports = router;
