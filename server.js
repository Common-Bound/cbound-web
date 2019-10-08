const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const redis = require("redis");
const RedisStore = require("connect-redis")(session);
const http = require("http");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
let client = redis.createClient();

const PORT = process.env.PORT || 4000;

const app = express();

/* 라우터 */
const apiRouter = require("./routes/apiRouter");
const cmdRouter = require("./cmdRouter");
/* logger */
// winston 과 morgan 을 이어준다
const logger = require("./config/logger");
app.use(
  require("morgan")(
    `":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`,
    { stream: logger.stream }
  )
);

/* 외부 라이브러리 미들웨어 사용 */
app.use("/", express.static(__dirname + "/client/build"));
/* SSL 인증 파일 접근 */
app.use("/.well-known", express.static(__dirname + "/.well-known"));
/* bodyParser */
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
    resave: false,
    saveUninitialized: true
  })
); // 세션 활성화
// passport.js 모듈 사용
app.use(passport.initialize()); // passport 구동
app.use(passport.session()); // 세션 연결
/* cors 허용 */
app.use(cors());

/* 사용자 작성 라우터 사용 */
app.use("/api", apiRouter);
app.use("/cmd", cmdRouter);

app.get("/*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"), function(err) {
    if (err) {
      logger.error(err);
      res.status(500).send(err);
    }
  });
});
/* SSL option */
const option =
  process.env.NODE_ENV === "production"
    ? {
        key: fs.readFileSync(
          __dirname + "/ssl/c-bound.io_2019091776EJ.key.pem"
        ),
        cert: fs.readFileSync(
          __dirname + "/ssl/c-bound.io_2019091776EJ.crt.pem"
        ),
        ca: fs.readFileSync(__dirname + "/ssl/ca-chain-bundle.pem")
      }
    : undefined;

// proudction 에서는 HTTPS 서버를, development 에서는 HTTP 서버를 사용한다.
option
  ? https.createServer(option, app).listen(PORT, () => {
      logger.info(`HTTPS Server is running at port ${PORT}`);
    })
  : http.createServer(app).listen(PORT, () => {
      logger.info(`HTTP Server is running at port ${PORT}`);
    });

// HTTPS 서버로 요청을 전달하여 자동으로 SSL 연결을 해주는 HTTP 서버
// SSL option 이 존재하지 않는 development 단계에서는 그냥 HTTP 서버만이 존재하게 됩니다.
option
  ? http
      .createServer(function(req, res) {
        res.writeHead(301, {
          Location: "https://" + req.headers["host"] + req.url
        });
        res.end();
      })
      .listen(80)
  : undefined;
