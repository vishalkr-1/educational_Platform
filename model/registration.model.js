const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
        
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
        
    },
    
},
   { timeStamps: true, versionKey: false }

)
const userModel = mongoose.model('users', userSchema)
module.exports = {
    userModel
}