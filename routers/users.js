const users = require('express').Router();

const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false });

const database = require('../controllers/database');
const userModel = require('../models/user');

users.get('/n', (req, res) => {
    res.render('users/signup');
});

users.post('/n', urlEncodedParser, (req, res) => {
    const user = new userModel(req.body);

    database.save(user).then((user) => {
        var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: "60 days" });
        res.cookie('nToken', token, { maxAge: 900000, httpOnly: false });
        res.redirect('/');
    }).catch((error) => {
        console.error(error);
        res.render('error');
    });
});

module.exports = users;