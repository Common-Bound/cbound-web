const express = require("express");
const router = express.Router();
const creatorRouter = require("./auth/creatorRouter");
const requesterrouter = require("./auth/requesterRouter");

// path: ~/auth
router.use("/", (req, res, next) => {
  console.log("/auth 라우터 도달");
  next();
});

router.use("/creator", creatorRouter);
router.use("/requester", requesterrouter);

module.exports = router;
