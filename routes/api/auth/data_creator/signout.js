const express = require("express");
const logger = require("../../../../config/logger");
const router = express.Router();

// path: ~/api/auth/creator/signout
router.get("/", (req, res, next) => {
  logger.info("로그아웃 user: " + req.user.id);
  req.logOut();
  console.log("req.session: ", req.session);
  res.json({ result: true });
});

module.exports = router;
