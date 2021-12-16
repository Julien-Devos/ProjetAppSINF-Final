const mongoose = require('mongoose');


const PostSchema = mongoose.Schema({
    game_id: {
        type: String,
        required: true
    },
    game: {
        type: String,
        required: false
    },
    author_id: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: true
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
    comments: {
        type: Number,
        default: 0
    },
    liked: {
        type: String,
        required: false,
        default: ""
    },
    like_id: {
        type: Array,
        default: []
    },
    postAuthor: {
        type: Boolean,
        default: false
    },
    subject: {
        type: String,
        default: "",
        index: true
    }


})

PostSchema.index({"subject":"text"});

module.exports = mongoose.model('Posts', PostSchema);