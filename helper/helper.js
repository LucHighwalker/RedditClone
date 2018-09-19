const user = require('../controllers/user');
const subr = require('../controllers/subreddits');

function render(res, token, path, requireUser, optParams = null) {
    let params = {}

    if (optParams !== null) {
        params = Object.assign(params, optParams);
    }

    if (requireUser && token === undefined) {
        res.redirect('/u/li');
    } else {
        user.getUser(token).then((curUser) => {
            subr.getSubreddits().then((subreddits) => {
                params.user = curUser;
                params.subreddits = subreddits;
                res.render(path, params)
            }).catch((error) => {
                console.error(error);
                res.render('error');
            });
        }).catch((error) => {
            console.error(error);
            res.render('error');
        });
    }
}

module.exports = {
    render: render
}