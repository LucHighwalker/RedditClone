const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auth = require('../controllers/auth');

const userSchema = new Schema({
    createdAt: { type: Date },
    updatedAt: { type: Date },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

userSchema.pre('save', function (next) {
    auth.encryptPassword(this).then(() => {
        next();
    }).catch((error) => {
        console.error(error);
        next();
    });
});

module.exports = mongoose.model('User', userSchema);