const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  const { rows } = await db.query("select * from test_user where id = $1", [
    id
  ]);
  res.send(rows[0]);
});

module.exports = router;
