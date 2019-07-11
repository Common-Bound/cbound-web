const express = require("express");
const router = express.Router();
const db = require("../../db/index");

// path: ~/mypage/projects
router.get("/", (req, res, next) => {
  if (req.user) {
    const user_id = req.user.id;
    db.query(
      "select * from creator_pool as c join project as p on c.project_id=p.id where c.creator_id=$1",
      [user_id],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        } else return res.json({ result: result.rows });
      }
    );
  }
});

module.exports = router;
