const mongoose = require('mongoose')
const coursesSchema = mongoose.Schema({
    courseName: {
        type: String,
        required: true
        
    },
    title: {
        type: String,
        required: true,
        
    },
    description: {
        type: String,
        required: true
    },
    userID: {
        type:String
    }
    
},
   { timeStamps: true, versionKey: false }

)
const courseModel = mongoose.model('courses', coursesSchema)
module.exports = {
    courseModel
}