require('dotenv').config();

const express = require('express');
const app = express();

const exphbs = require('express-handlebars');

const postRouter = require('./routers/posts');
const userRouter = require('./routers/users');

const cookieMonster = require('cookie-parser');
app.use(cookieMonster());

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
    console.log(req.cookies);
    res.render('home');
});

app.use('/p', (req, res, next) => {
    req.search = req.query.search;
    next();
}, postRouter);

app.use('/u', (req, res, next) => {
    next();
}, userRouter);