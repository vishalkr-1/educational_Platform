const express = require("express");
const { handleSearch } = require("../controllers/search.controller");
const { restrictToLoggedInUserOnly } = require("../middleware/auth");
const searchRouter = express.Router();
searchRouter.get("/name", restrictToLoggedInUserOnly, handleSearch);

module.exports = { searchRouter };
