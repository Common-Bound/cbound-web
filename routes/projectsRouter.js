const express = require("express");
const router = express.Router();
const db = require("../db/index");

// path: ~/projects
router.get("/", (req, res, next) => {
  const sql = "select * from project";
  db.query(sql, [], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    return res.json({ result: ["hello", "hi", "hi there"] });
  });
});

module.exports = router;
