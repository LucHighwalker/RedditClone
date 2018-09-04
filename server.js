const express = require('express');
const app = express();

const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const database = require('./database');
const PostModel = require('./models/post');

urlEncodedParser = bodyParser.urlencoded({extended: false});

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

app.get('/posts/create', (req, res) => {
    res.render('posts-new');
});

app.post('/posts/new', urlEncodedParser, (req, res) => {
    var post = new PostModel(req.body);

    database.save(post).then(() => {
        res.render('posts-success');
    }).catch((error) => {
        console.error(error);
    });
});

app.post('/posts/del', urlEncodedParser, (req, res) => {
    var post = new PostModel(req.body);
    var id = post._id;

    console.log(post);

    database.del(PostModel, id).then(() => {
        res.render('posts-success');
    }).catch((error) => {
        console.error(error);
    });
});

app.get('/posts/:id', function (req, res) {
    var id = req.params.id;
    database.getOne(PostModel, id).then((post) => {
        res.render('post-show.hbs', { post });
    }).catch((error) => {
        console.error(error);
    });
});