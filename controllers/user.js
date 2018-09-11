const database = require('./database');
const auth = require('./auth');
const userModel = require('../models/user');

function logIn(username, password) {
    return new Promise((resolve, reject) => {
        userModel.findOne({ username: username }, (err, user) => {
            if (err) {
                reject(err);
            } else if (!user) {
                reject('Incorrect username/password.');
            } else {
                auth.comparePassword(password, user.password).then((match) => {
                    if (match) {
                        resolve(user);
                    } else {
                        reject('Incorrect username/password.');
                    }
                }).catch((error) => {
                    reject(error);
                });
            }
        });
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
    logIn: logIn,
    signUp: signUp
}