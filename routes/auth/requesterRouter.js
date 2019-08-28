const express = require("express");
const router = express.Router();
const signupRouter = require("./data_requester/signup");
const signinRouter = require("./data_requester/signin");
const signoutRouter = require("./data_requester/signout");

// path: ~/auth/requester
router.use("/signup", signupRouter);
router.use("/signin", signinRouter);
router.use("/signout", signoutRouter);

module.exports = router;
