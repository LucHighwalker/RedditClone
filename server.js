const express = require('express');
const app = express();

const exphbs = require('express-handlebars');

const postRouter = require('./routers/posts');

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

app.use('/posts', (req, res, next) => {
    req.search = req.query.search;
    next();
}, postRouter);