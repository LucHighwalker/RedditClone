const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    createdAt: { type: Date },
    updatedAt: { type: Date },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, select: false }
});

module.exports = mongoose.model('User', userSchema);