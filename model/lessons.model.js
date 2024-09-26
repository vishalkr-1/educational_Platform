const mongoose = require('mongoose')
const lessonSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,

    },
    content: {
        type: String,
        required: true
    },
    courseID: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseModel', required: true },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel', required: true },

},
    { timeStamps: true, versionKey: false }

)
const lessonModel = mongoose.model('lessons', lessonSchema)
module.exports = {
    lessonModel
}