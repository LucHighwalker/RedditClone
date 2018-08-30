const express = require('express');
const app = express();

const exphbs = require('express-handlebars');

const database = require('./database');

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
    database.getAllPosts().then((response) => {
        res.render('posts', {
            posts: response
        });
    }).catch((error) => {
        console.error(error);
        res.render('error');
    })
})

app.get('/posts/new', (req, res) => {
    res.render('posts-new');
});

app.get('/createpost', (req, res) => {
    var post = new database.postModel({
        title: 'hi',
        url: 'https://luc.gg',
        summary: 'hdasfvkjahsdf'
    });

    database.savePost(post).then(() => {
        res.render('posts-success');
    }).catch((error) => {
        console.error(error);
    })
});