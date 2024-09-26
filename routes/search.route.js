const express = require("express");
const { handleSearch } = require("../controllers/search.controller");
const { restrictToLoggedInUserOnly } = require("../middleware/auth");
const searchRouter = express.Router();
// **************************************************************************
// search functionality
searchRouter.get("/name", handleSearch);

module.exports = { searchRouter };
