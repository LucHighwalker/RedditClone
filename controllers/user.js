const database = require('./database');

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

function signUp(user) {
    return new Promise((resolve, reject) => {
        database.save(user).then((user) => {
            resolve(user);
        }).catch((error) => {
            reject(error);
        });
    })
}

module.exports = {
    encryptPassword: encryptPassword,
    signUp: signUp
}