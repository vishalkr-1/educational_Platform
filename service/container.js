const jwt = require('jsonwebtoken')
const secretKey = "vishal$123$"
function setCourseUser(course) {
  console.log("setUser called")
  return jwt.sign({
    _courseID: course._id,
    _userID: course.userID
  }, secretKey)

}
function getCourseUser(token) {
  console.log("inside getCOurseUSer")
  if (!token) return null
  return jwt.verify(token, secretKey)
}
module.exports = {
  setCourseUser,
  getCourseUser
}