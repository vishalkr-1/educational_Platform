const { getUser } = require("../service/auth")

async function restrictToLoggedInUserOnly(req, res, next) {
    console.log("restrictToLoggedInUserOnly")
    const token = req.cookies.uid
    // console.log(userUid)
    if (!token) {
        return res.redirect("/static/login")
    }
    const user = getUser(token)
    // console.log("user", user)
    if (!user) {
        return res.redirect("/static/login")
    }
    req.user = user
    req.body.userID = user._UserID
    //  console.log('Assigned userID:', req.body.userID);
    next()
}
module.exports = {
    restrictToLoggedInUserOnly
}