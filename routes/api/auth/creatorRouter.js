const express = require("express");
const router = express.Router();
const signupRouter = require("./data_creator/signup");
const signinRouter = require("./data_creator/signin");
const signoutRouter = require("./data_creator/signout");

// path: ~/api/auth/creator
router.use("/signup", signupRouter);
router.use("/signin", signinRouter);
router.use("/signout", signoutRouter);

module.exports = router;
