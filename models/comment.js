const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Comment', commentSchema, 'comments');