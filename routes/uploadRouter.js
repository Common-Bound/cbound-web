const express = require("express");
const router = express.Router();
const multer = require("multer");
const memory = multer.memoryStorage();

const upload = multer({
  //dest: "upload/"
  storage: memory
});

// path: ~/upload
router.post("/", upload.single("imgFile"), (req, res, next) => {
  console.log("upload 라우터 도착");
  console.log(req.body);

  console.log(req.file);
  console.log(req.body.json);
  return res.json({ result: true });
});

module.exports = router;
