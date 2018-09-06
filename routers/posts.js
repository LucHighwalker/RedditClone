const posts = require('express').Router();

const bodyParser = require('body-parser');
const database = require('../controllers/database');

const PostModel = require('../models/post');

urlEncodedParser = bodyParser.urlencoded({extended: false});

posts.get('/', (req, res) => {
    var search = req.search;

    database.getAll(PostModel, search).then((response) => {
        res.render('posts/posts', {
            posts: response
        });
    }).catch((error) => {
        console.error(error);
        res.render('error');
    });
});

posts.get('/create', (req, res) => {
    res.render('posts/new');
});

posts.post('/new', urlEncodedParser, (req, res) => {
    var post = new PostModel(req.body);

    database.save(post).then(() => {
        res.render('posts/success');
    }).catch((error) => {
        console.error(error);
    });
});

posts.post('/del', urlEncodedParser, (req, res) => {
    var post = new PostModel(req.body);
    var id = post._id;

    console.log(post);

    database.del(PostModel, id).then(() => {
        res.render('posts/success');
    }).catch((error) => {
        console.error(error);
    });
});

posts.get('/:id', function (req, res) {
    var id = req.params.id;
    database.getOne(PostModel, id).then((post) => {
        res.render('posts/show.hbs', { post });
    }).catch((error) => {
        console.error(error);
    });
});

module.exports = posts;