const users = require('express').Router();

const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false });

const controller = require('../controllers/user');
const userModel = require('../models/user');

function generateToken(data, expiration) {
    return jwt.sign(data, process.env.SECRET, { expiresIn: expiration });
}

users.get('/li', (req, res) => {
    res.render('users/login');
});

users.post('/li', urlEncodedParser, (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    controller.logIn(username, password).then((user) => {
        var token = generateToken({ _id: user._id }, '60 days')
        res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
        res.redirect('/');
    }).catch((error) => {
        if (error === 'incorrect') {
            res.render('users/login', {
                warning: true,
                username: username
            });
        } else {
            console.error(error);
            res.render('error');
        }
    });
});

users.get('/lo', (req, res) => {
    res.clearCookie('nToken');
    res.redirect('/');
});

users.get('/su', (req, res) => {
    res.render('users/signup');
});

users.post('/su', urlEncodedParser, (req, res) => {
    const user = new userModel(req.body);

    controller.signUp(user).then((user) => {
        var token = generateToken({ _id: user._id }, '60 days')
        res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
        res.redirect('/');
    }).catch((error) => {
        console.error(error);
        res.render('error');
    });
});

module.exports = users;