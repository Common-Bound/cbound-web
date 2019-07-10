const express = require("express");
const router = express.Router();

// path: ~/mypage/main
router.get("/", (req, res, next) => {
  console.log("요청자 세션 : ", req.user);
  if (req.user) {
    return res.json({ result: true });
  } else return res.status(401).json({ result: false });
});

module.exports = router;
