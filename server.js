const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const redis = require("redis");
const RedisStore = require("connect-redis")(session);
const http = require('http');
const https = require('https');
const fs = require('fs');
let client = redis.createClient();

const PORT = process.env.PORT || 4000;

const app = express();

/* 라우터 */
const authRouter = require("./routes/authRouter");
const mypageRouter = require("./routes/mypageRouter");

/* 외부 라이브러리 미들웨어 사용 */
app.use("/", express.static(__dirname + "/client/build"));
/* SSL 인증 파일 접근 */
app.use('/.well-known', express.static(__dirname + "/.well-known"));
app.use(morgan("dev"));
app.use(
  bodyParser.json({
    limit: "50mb",
    extended: true
  })
);
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(
  session({
    store: new RedisStore({ client }),
    secret: "myKey",
    resave: false
  })
); // 세션 활성화
// passport.js 모듈 사용
app.use(passport.initialize()); // passport 구동
app.use(passport.session()); // 세션 연결
/* 사용자 작성 라우터 사용 */
app.use("/auth", authRouter);
app.use("/mypage", mypageRouter);


app.get("/", (req, res, next) => {
  console.log('hello world');
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

/* SSL option */
const option = {
  key: fs.readFileSync(__dirname + '/ssl/c-bound.io_2019091776EJ.key.pem'),
  cert: fs.readFileSync(__dirname + '/ssl/c-bound.io_2019091776EJ.crt.pem'),
  ca: fs.readFileSync(__dirname + '/ssl/ca-chain-bundle.pem'),
}

// https server
https.createServer(option, app).listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

// http server to redirect to https
http.createServer(function (req, res) {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
}).listen(80);