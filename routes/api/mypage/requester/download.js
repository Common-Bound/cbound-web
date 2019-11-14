const express = require("express");
const router = express.Router();
const db = require("../../../../db/index");
require("moment-timezone");
const logger = require("../../../../config/logger");

// path: ~/api/mypage/requester/download
router.get("/:project_id", async (req, res, next) => {
  // 해당 프로젝트에서 검수가 완료되었고, 상태가 done인 데이터를 모두 가져온다
  const project_id = req.params.project_id;
  const query = `select * from data where project_id = $1 and status='done'`;
  const response = await db
    .query(query, [project_id])
    .then(res => res.rows)
    .catch(err => logger.error(err));

  return res.json(response);
});

module.exports = router;
