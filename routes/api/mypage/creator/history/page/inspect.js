const express = require("express");
const router = express.Router();
const db = require("../../../../../../db/index");
const logger = require("../../../../../../config/logger");

// path: ~/mypage/creator/history/page/inspection
router.get("/:page_num", async (req, res, next) => {
  const page_num = req.params.page_num;
  console.log("page_num: ", page_num);
  const sql2 = `select data.id, inspected_at as date, title, reward from inspector_pool 
  join data 
  on inspector_pool.data_id = data.id
  join project
  on data.project_id = project.id
  where inspector_pool.inspector_id = $1 order by date desc limit $2 offset $3`;
  const result = await db
    .query(sql2, [req.user.id, 20, page_num * 20])
    .then(res => res.rows)
    .catch(err => {
      logger.error(err);
      return res.status(500).send(err);
    });
  console.log(result[0]);

  return res.status(200).json({ result: result });
});

module.exports = router;
