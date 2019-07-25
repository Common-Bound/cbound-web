const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({
  dest: "upload/"
});

// path: ~/upload
router.post("/", upload.single("imgFile"), (req, res, next) => {
  console.log("upload 라우터 도착");
  console.log(req.file);

  return res.json({ result: true });
});

module.exports = router;
