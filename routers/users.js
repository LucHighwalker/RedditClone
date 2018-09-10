const users = require('express').Router();

const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false });

const controller = require('../controllers/user');
const userModel = require('../models/user');

users.get('/li', (req, res) => {
    res.render('users/login');
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
        var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: "60 days" });
        res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
        res.redirect('/');
    }).catch((error) => {
        console.error(error);
        res.render('error');
    });
});

module.exports = users;