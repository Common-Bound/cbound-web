const express = require("express");
const path = require("path");
const morgan = require("morgan");
const PORT = process.env.PORT || 4000;

const app = express();

app.use(express.static(__dirname + "/client/public"));
app.use(morgan("dev"));

app.get("/hello", (req, res, next) => {
  res.json("Hello World!");
});

app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
