const jwt = require('jsonwebtoken');

const database = require('./database');
const auth = require('./auth');
const userModel = require('../models/user');

function getUser(token) {
    return new Promise((resolve, reject) => {
        if (token !== undefined) {
            var decodedToken = jwt.decode(token);
            userModel.findOne({
                _id: decodedToken._id
            }, (err, resp) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        _id: resp._id,
                        username: resp.username
                    });
                }
            });
        } else {
            resolve(null);
        }
    });
}

function logIn(username, password) {
    return new Promise((resolve, reject) => {
        userModel.findOne({
            username: username
        }, (err, user) => {
            if (err) {
                reject(err);
            } else if (!user) {
                reject('incorrect');
            } else {
                auth.comparePassword(password, user.password).then((match) => {
                    if (match) {
                        resolve(user);
                    } else {
                        reject('incorrect');
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
    getUser: getUser,
    logIn: logIn,
    signUp: signUp
}