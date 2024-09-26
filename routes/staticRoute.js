const express = require("express");
const { restrictToLoggedInUserOnly } = require("../middleware/auth");
const { restrictToLoggedInUserOnlyLesson } = require("../middleware/lesson");
const staticRouter = express.Router();

// *****************************************************************************
staticRouter.use("/signup", (req, res) => {
  res.render("signup");
});
// ********************************************************************************
staticRouter.use("/login", (req, res) => {
  res.render("login");
});
// *************************************************************************************
staticRouter.use("/home", restrictToLoggedInUserOnly, (req, res) => {
  res.render("home");
});
// ***********************************************************************************************
staticRouter.use("/lesson", restrictToLoggedInUserOnly, (req, res) => {
  res.render("lesson");
});
// ******************************************************************************************************
staticRouter.use("/search", (req, res) => {
  res.render("searchName");
});
// *********************************************************************************************************************
module.exports = {
  staticRouter,
};
