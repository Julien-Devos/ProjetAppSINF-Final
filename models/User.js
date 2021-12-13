const mongoose = require('mongoose');


const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        default: ""
    }

})

module.exports = mongoose.model('Users', UserSchema);