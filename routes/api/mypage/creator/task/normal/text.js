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

// path: ~/api/mypage/creator/task/normal/text
router.post("/", upload_mem.single("orig_image"), (req, res, next) => {
  const imageSrc = req.body.orig_image;
  const id = uuid();
  const url = `${endpoint.url}/ocr/detection/`;
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
  const url = `${endpoint.url}/ocr/recognition/`;

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

router.post("/compare_string", (req, res, next) => {
  const label = req.body.label;
  const ai_label = req.body.ai_label;
  const url = `${endpoint.url}/ocr/compare_string/`;

  axios
    .post(url, {
      method: "post",
      label: label,
      ai_label: ai_label
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

router.post("/predict", (req, res, next) => {
  const crop_image = req.body.crop_image;
  const url = `${endpoint.url}/inspection/predict/`;

  axios
    .post(url, {
      method: "post",
      crop_image: crop_image
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
