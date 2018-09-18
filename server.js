require('dotenv').config();

const express = require('express');
const app = express();

const exphbs = require('express-handlebars');

const postRouter = require('./routers/posts');
const userRouter = require('./routers/users');

const auth = require('./controllers/auth');
const user = require('./controllers/user');
const subr = require('./controllers/subreddits');

const cookieMonster = require('cookie-parser');
app.use(cookieMonster());

// App initialization
app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    helpers: {
        isWarning: (warning) => {
            return warning ? ' warning' : '';
        }
    }
}));
app.set('view engine', 'hbs');
app.use(express.static('public'));

app.listen(4200, () => {
    console.log('Reddit clone is listening on localhost:4200');
});

app.get('/', (req, res) => {
    let token = req.cookies.nToken;
    user.getUser(token).then((cur_user) => {
        subr.getSubreddits().then((subreddits) => {
            res.render('home', {
                user: cur_user,
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

app.use('/r', (req, res, next) => {
    req.search = req.query.search;
    next();
}, postRouter);

app.use('/u', (req, res, next) => {
    next();
}, userRouter);