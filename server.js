const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const PORT = process.env.PORT || 4000;

const app = express();

/* 라우터 */
const userRouter = require("./routes/user");

/* 외부 라이브러리 미들웨어 사용 */
app.use(express.static(__dirname + "/client/public"));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/* 사용자 작성 라우터 사용 */
app.use("/users", userRouter);

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
