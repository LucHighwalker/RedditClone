const users = require('express').Router();

const bodyParser = require('body-parser');
const database = require('../controllers/database');
const userModel = require('../models/user');

urlEncodedParser = bodyParser.urlencoded({extended: false});

users.post('/signup', urlEncodedParser, (req, res) => {
    const user = new userModel(req.body);

    database.save(user).then(() => {
        res.redirect('/');
    }).catch((error) => {
        console.error(error);
        res.render('error');
    });
});

module.exports = users;