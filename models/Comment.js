const mongoose = require('mongoose');


const CommentSchema = mongoose.Schema({
    post_id: {
        type: String,
        required: true
    },
    author_id: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: () => Date.now()
    },
    displayedDate: {
        type: String,
        required: false
    },
    likes: {
        type: Number,
        default: 0
    },
    like_id: {
        type: Array,
        default: []
    },
    commentAuthor: {
        type: Boolean,
        default: false
    }

})

module.exports = mongoose.model('Comments', CommentSchema);