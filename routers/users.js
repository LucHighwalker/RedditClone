const users = require('express').Router();

const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({
    extended: false
});

const subr = require('../controllers/subreddits');
const controller = require('../controllers/user');
const userModel = require('../models/user');
const helper = require('../helper/helper');

function generateToken(data, expiration) {
    return jwt.sign(data, process.env.SECRET, {
        expiresIn: expiration
    });
}

users.get('/li', (req, res) => {
    let token = req.token;
    helper.render(res, token, 'users/login', false);
});

users.post('/li', urlEncodedParser, (req, res) => {
    let token = req.token;
    let username = req.body.username;
    let password = req.body.password;

    controller.logIn(username, password).then((user) => {
        var token = generateToken({
            _id: user._id
        }, '60 days')
        res.cookie('nToken', token, {
            maxAge: 900000,
            httpOnly: true
        });
        res.redirect('/');
    }).catch((error) => {
        if (error === 'incorrect') {
            helper.render(res, token, 'users/login', false, {
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
    let token = req.token;
    helper.render(res, token, 'users/signup', false);
});

users.post('/su', urlEncodedParser, (req, res) => {
    const user = new userModel(req.body);

    controller.signUp(user).then((user) => {
        var token = generateToken({
            _id: user._id
        }, '60 days')
        res.cookie('nToken', token, {
            maxAge: 900000,
            httpOnly: true
        });
        res.redirect('/');
    }).catch((error) => {
        console.error(error);
        res.render('error');
    });
});

module.exports = users;