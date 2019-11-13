const express = require("express");
const router = express.Router();
const multer = require("multer");
const uuid = require("uuid/v4");
const axios = require("axios");
const memory = multer.memoryStorage();
const endpoint = require("../../../../../AIserverEndpoint");
const logger = require("../../../../../../config/logger");

const upload_mem = multer({
  storage: memory,
  limits: { fieldSize: 10 * 2048 * 2048 }
});

// path: ~/api/mypage/creator/task/normal/object
router.post("/", upload_mem.single("orig_image"), (req, res, next) => {
  const imageSrc = req.body.crop_image;
  const id = uuid();
  const url = `${endpoint.url}/object/detection/`;
  axios
    .post(url, {
      id: id,
      method: "post",
      orig_image: imageSrc
    })
    .then(res => res.data)
    .then(data => {
      console.log(data);
      return res.json({ data: data });
    })
    .catch(err => {
      logger.error(err);
      return res.status(500).json({ error: err });
    });
});

router.post("/recognition", (req, res, next) => {
  const imageSrc = req.body.crop_image;
  const id = req.body.id;
  const url = `${endpoint.url}/object/recognition/`;

  axios
    .post(url, {
      id: id,
      crop_image: imageSrc,
      method: "post"
    })
    .then(res => res.data)
    .then(data => {
      console.log(data);
      return res.json({ data: data });
    })
    .catch(err => {
      logger.error(err);
      return res.status(500).json({ error: err });
    });
});

module.exports = router;
