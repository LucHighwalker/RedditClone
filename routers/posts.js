const posts = require('express').Router();

const bodyParser = require('body-parser');
const database = require('../controllers/database');
const commentController = require('../controllers/comments');
const postController = require('../controllers/posts');
const subr = require('../controllers/subreddits');

const PostModel = require('../models/post');

urlEncodedParser = bodyParser.urlencoded({
    extended: false
});

// posts.get('/', (req, res) => {
//     var subreddit = req.params.subreddit;
//     var search = req.search;

//     database.getAll(PostModel, search).then((response) => {
//         res.render('posts/posts', {
//             subreddit: subreddit,
//             posts: response
//         });
//     }).catch((error) => {
//         console.error(error);
//         res.render('error');
//     });
// });

posts.get('/n', (req, res) => {
    subr.getSubreddits().then((subreddits) => {
        res.render('posts/new', {
            subreddits: subreddits
        });
    }).catch((error) => {
        console.error(error);
        res.render('error');
    });
});

posts.post('/n', urlEncodedParser, (req, res) => {
    var post = new PostModel(req.body);

    postController.savePost(post).then(() => {
        subr.getSubreddits().then((subreddits) => {
            res.render('posts/success', {
                subreddits: subreddits
            });
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
    var post = new PostModel(req.body);
    var id = post._id;

    database.del(PostModel, id).then(() => {
        subr.getSubreddits().then((subreddits) => {
            res.render('posts/success', {
                subreddits: subreddits
            });
        }).catch((error) => {
            console.error(error);
            res.render('error');
        });
    }).catch((error) => {
        console.error(error);
        res.render('error');
    });
});

posts.get('/:subreddit/:id', (req, res) => {
    var subreddit = req.params.subreddit;
    var id = req.params.id;

    database.populateOne(PostModel, id, "comments").then((post) => {
        subr.getSubreddits().then((subreddits) => {
            res.render('posts/show', {
                post,
                subreddits: subreddits,
                subreddit: subreddit
            });
        }).catch((error) => {
            console.error(error);
            res.render('error');
        });

    }).catch((error) => {
        console.error(error);
        res.render('error');
    });
});

posts.post('/:subreddit/:id/c', urlEncodedParser, (req, res) => {
    var subreddit = req.params.subreddit;
    var id = req.params.id;
    var content = req.body.content ? req.body.content : null;

    commentController.saveComment(id, content).then(() => {
        res.redirect('/r/' + subreddit + '/' + id);
    }).catch((error) => {
        console.error(error);
        res.render('error');
    });
});

posts.get('/:subreddit', (req, res) => {
    var subreddit = req.params.subreddit;
    var search = req.search;

    database.getAll(PostModel, search, subreddit).then((response) => {
        subr.getSubreddits().then((subreddits) => {
            res.render('posts/posts', {
                subreddits: subreddits,
                subreddit: subreddit,
                posts: response
            });
        }).catch((error) => {
            console.error(error);
            res.render('error');
        });

    }).catch((error) => {
        console.error(error);
        res.render('error');
    });
});

module.exports = posts;