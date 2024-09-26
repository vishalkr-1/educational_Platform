const { getUser } = require("../service/auth")

async function restrictToLoggedInUserOnlyLesson(req, res, next) {

}

module.exports = {
    restrictToLoggedInUserOnlyLesson
}