const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    createdAt: { type: Date },
    updatedAt: { type: Date },
    title: { type: String, required: true, text: true },
    url: { type: String, required: true, text: true },
    summary: { type: String, required: true, text: true }
});

module.exports = mongoose.model('Post', postSchema);