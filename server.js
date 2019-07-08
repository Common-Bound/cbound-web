const express = require("express");
const path = require("path");
const morgan = require("morgan");
const PORT = process.env.PORT || 4000;

const app = express();

/* 라우터 */
const userRouter = require("./routes/user");

/* 미들웨어 사용 */
app.use(express.static(__dirname + "/client/public"));
app.use(morgan("dev"));
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
