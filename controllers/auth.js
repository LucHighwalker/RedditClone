const bcrypt = require('bcrypt');

function encryptPassword(user) {
    return new Promise((resolve, reject) => {
        if (!user.isModified('password')) {
            resolve();
        } else {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    reject(err);
                }
                bcrypt.hash(user.password, salt, (err, hash) => {
                    if (err) {
                        reject(err);
                    }
                    user.password = hash;
                    resolve();
                });
            });
        }
    });
}

function comparePassword(password, hashedPass) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashedPass, (err, isMatch) => {
            if (err) {
                reject(err);
            } else {
                resolve(isMatch);
            }
        });
    });
}

module.exports = {
    encryptPassword: encryptPassword,
    comparePassword: comparePassword
}