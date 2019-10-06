const express = require("express");
const router = express.Router();
const creatorRouter = require("./auth/creatorRouter");
const requesterrouter = require("./auth/requesterRouter");

// path: ~/api/auth
router.use("/creator", creatorRouter);
router.use("/requester", requesterrouter);

module.exports = router;
