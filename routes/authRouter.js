const express = require("express");
const router = express.Router();
const signupRouter = require("./auth/signup");
const signinRouter = require("./auth/signin");

// path: ~/auth
router.use("/", (req, res, next) => {
  console.log("/auth 라우터 도달");
  next();
});
router.use("/signup", signupRouter);
router.use("/signin", signinRouter);

module.exports = router;
