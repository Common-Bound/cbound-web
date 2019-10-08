const express = require("express");
const router = express.Router();
const exec = require("child_process").exec;

// path: ~/cmd
router.get("/deploy", (req, res, next) => {
  console.log("/cmd/deploy 요청 도착");
  const child = exec(
    "git pull origin master && yarn && yarn build && pm2 start ecosystem.config.js --env production",
    function(error, stdout, stderr) {
      console.log("stdout: " + stdout);
      console.log("stderr: " + stderr);
      if (error !== null) {
        console.log("exec error: " + error);
        return res.status(500).send(error);
      }
      return res.send(true);
    }
  );
});

module.exports = router;
