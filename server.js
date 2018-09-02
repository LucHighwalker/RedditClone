const express = require('express');
const app = express();

const exphbs = require('express-handlebars');

const bodyParser = require('body-parser');

const database = require('./database');

const PostModel = require('./models/post');

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
    database.getAll(PostModel).then((response) => {
        res.render('posts', {
            posts: response
        });
    }).catch((error) => {
        console.error(error);
        res.render('error');
    });
});

app.get('/posts/:id', function (req, res) {
    var id = req.params.id;
    database.find(PostModel, id).then((post) => {
        res.render('post-show.hbs', { post });
    }).catch((error) => {
        console.error(error);
    });
});

app.get('/posts/new', (req, res) => {
    res.render('posts-new');
});

urlEncodedParser = bodyParser.urlencoded({extended: false});
app.post('/posts/new', urlEncodedParser, (req, res) => {
    var post = new PostModel(req.body);

    database.save(post).then(() => {
        res.render('posts-success');
    }).catch((error) => {
        console.error(error);
    });
});