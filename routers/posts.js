const posts = require('express').Router();

const bodyParser = require('body-parser');
const database = require('../controllers/database');
const user = require('../controllers/user');
const commentController = require('../controllers/comments');
const postController = require('../controllers/posts');
const helper = require('../helper/helper');

const PostModel = require('../models/post');

urlEncodedParser = bodyParser.urlencoded({
    extended: false
});

// posts.get('/', (req, res) => {
    //TODO: create a view to display subreddits.
// });

posts.get('/n', (req, res) => {
    let token = req.token;
    helper.render(res, token, 'posts/new', true);
});

posts.post('/n', urlEncodedParser, (req, res) => {
    let token = req.token;
    let post = new PostModel(req.body);

    user.getUser(token).then((author) => {
        postController.savePost(post, author).then(() => {
            helper.render(res, token, 'posts/success', true);
        }).catch((error) => {
            console.error(error);
            res.render('error');
        });
    }).catch((error) => {
        console.error(error);
        res.render('error');
    });
});

posts.post('/d', urlEncodedParser, (req, res) => {
    let token = req.token;
    let post = new PostModel(req.body);
    let id = post._id;

    database.del(PostModel, id).then(() => {
        helper.render(res, token, 'posts/success', true);
    }).catch((error) => {
        console.error(error);
        res.render('error');
    });
});

posts.get('/:subreddit/:id', (req, res) => {
    let token = req.token;
    let subreddit = req.params.subreddit;
    let id = req.params.id;

    database.populateTwo(PostModel, id, "comments", "author").then((post) => {
        console.log(post);
        helper.render(res, token, 'posts/show', false, {
            post,
            subreddit: subreddit
        });
    }).catch((error) => {
        console.error(error);
        res.render('error');
    });
});

posts.post('/:subreddit/:id/c', urlEncodedParser, (req, res) => {
    let token = req.token;
    let subreddit = req.params.subreddit;
    let id = req.params.id;
    let content = req.body.content ? req.body.content : null;

    user.getUser(token).then((author) => {
        commentController.saveComment(id, content, author).then(() => {
            res.redirect('/r/' + subreddit + '/' + id);
        }).catch((error) => {
            console.error(error);
            res.render('error');
        });
    }).catch((error) => {
        console.error(error);
        res.render('error');
    });
});

posts.get('/:subreddit', (req, res) => {
    let token = req.token;
    let subreddit = req.params.subreddit;
    let search = req.search;

    database.getAll(PostModel, search, subreddit).then((response) => {
        helper.render(res, token, 'posts/posts', false, {
            subreddit: subreddit,
            posts: response
        });
    }).catch((error) => {
        console.error(error);
        res.render('error');
    });
});

module.exports = posts;