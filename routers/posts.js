const posts = require('express').Router();

const bodyParser = require('body-parser');
const database = require('../controllers/database');
const comment = require('../controllers/comments');

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

posts.get('/:id', (req, res) => {
    var id = req.params.id;
    database.getOne(PostModel, id).then((post) => {
        res.render('posts/show.hbs', { post });
    }).catch((error) => {
        console.error(error);
    });
});

posts.post('/:id/comment', urlEncodedParser, (req, res) => {
    var id = req.params.id;
    var content = req.body.content ? req.body.content : null;
    comment.saveComment(id, content).then(() => {
        res.render('posts/success');
    }).catch((error) => {
        console.error(error);
        res.render('error');
    });
});

module.exports = posts;