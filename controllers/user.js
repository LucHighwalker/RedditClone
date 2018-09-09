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

module.exports = {
    encryptPassword: encryptPassword
}