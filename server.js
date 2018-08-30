const express = require('express');
const app = express();

const exphbs = require('express-handlebars');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', {
    useNewUrlParser: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('database connected')
});

var modPost = mongoose.model('Post', {
    title: String,
    post: String,
    postID: String,
    userID: String,
});

// App initialization
app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    helpers: {
        //helper functions
    }
}));
app.set('view engine', 'hbs');
app.use(express.static('public'));

app.listen(4200, () => {
    console.log('Reddit clone is listening on localhost:4200');
});

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/posts', (req, res) => {
    modPost.find({}, (err, response) => {
        if (err) {
            console.error(err);
            res.render('error');
        } else {
            console.log(response);
            res.render('posts', {
                posts: response
            });
        }
    });
})

app.get('/posts/new', (req, res) => {
    res.render('posts-new');
});

app.get('/createpost', (req, res) => {
    var title = req.query.title ? req.query.title : null;
    var content = req.query.content ? req.query.content : null;

    var post = new modPost({
        title: title,
        content: content,
        postID: 'abcdef1234',
        userID: 'test1234'
    });

    post.save((error => {
        if (error) {
            console.error(error);
            res.render('error');
        } else {
            console.log('Saved post.');
            res.render('posts-success');
        }
    }))
});