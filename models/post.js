const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const comments = require('./comment');

const postSchema = new Schema({
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    },
    title: {
        type: String,
        required: true,
        text: true
    },
    url: {
        type: String,
        required: true,
        text: true
    },
    summary: {
        type: String,
        required: true,
        text: true
    },
    comments: [comments.schema],
    subreddit: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Post', postSchema);