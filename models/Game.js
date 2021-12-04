const mongoose = require('mongoose');


const GameSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Games', GameSchema);