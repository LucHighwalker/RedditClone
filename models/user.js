const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auth = require('../controllers/user');

const userSchema = new Schema({
    createdAt: { type: Date },
    updatedAt: { type: Date },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, select: false }
});

userSchema.pre('save', function (next) {
    auth.encryptPassword(this).then(() => {
        next()
    }).catch((error) => {
        console.error(error);
        next();
    });
});

userSchema.methods.comparePassword = (password, done) => {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        done(err, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema);