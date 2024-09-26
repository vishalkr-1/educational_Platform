const express = require("express");
const { redis } = require("./client");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 4500;

app.get("/server", (req, res) => {
  res.status(200).send("route is working");
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var cookieParser = require("cookie-parser");
app.use(cookieParser());

const { userRouter } = require("./routes/user.route");
app.use("/users", userRouter);

const { staticRouter } = require("./routes/staticRoute");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use("/static", staticRouter);

const { courseRouter } = require("./routes/courses.route");
app.use("/courses", courseRouter);

const { lessonRouter } = require("./routes/lessons.route");
app.use("/lesson", lessonRouter);

const { searchRouter } = require("./routes/search.route");
app.use("/search", searchRouter);
const connection = require("./dbConnection/db");
app.listen(port, async () => {
  try {
    await connection;
    console.log("server is connected to database");
  } catch (err) {
    console.log(err);
  }
  console.log(`server is started at ${port}`);
});
