const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const PORT = process.env.PORT || 4000;

const app = express();

/* 라우터 */
const authRouter = require("./routes/authRouter");
const mypageRouter = require("./routes/mypageRouter");
const projectsRouter = require("./routes/projectsRouter");
const taskRouter = require("./routes/taskRouter");

/* 외부 라이브러리 미들웨어 사용 */
app.use("/public", express.static(__dirname + "/client/public"));
app.use(morgan("dev"));
app.use(
  bodyParser.json({
    limit: "10mb",
    extended: true
  })
);
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(session({ secret: "myKey" })); // 세션 활성화
// passport.js 모듈 사용
app.use(passport.initialize()); // passport 구동
app.use(passport.session()); // 세션 연결
/* 사용자 작성 라우터 사용 */
app.use("/auth", authRouter);
app.use("/mypage", mypageRouter);
app.use("/projects", projectsRouter);
app.use("/task", taskRouter);

/* 라우트 */
app.get("/hello", (req, res, next) => {
  res.json("hello world");
});

app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
