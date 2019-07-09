const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  req.logOut();
  res.json({ result: true });
});

module.exports = router;
