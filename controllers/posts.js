const database = require('./database');

const SubrModel = require('../models/subreddits');

function savePost(post) {
    return new Promise((resolve, reject) => {

        checkSubreddits(post.subreddit).then((found) => {
            console.log('Found subreddit: ' + found);
        }).catch((err) => {
            console.error(err);
            console.error('Error checking subreddits!');
        });

        database.save(post).then(() => {
            resolve(post);
        }).catch((err) => {
            reject(err);
        });
    }).catch((error) => {
        console.error(error);
        reject(error);
    });
}

function checkSubreddits(subreddit) {
    return new Promise((resolve, reject) => {
        database.getAll(SubrModel).then((resp) => {
            if (resp.length > 0) {
                let subreddits = resp[0];
                for (var i = 0; i < subreddits.content.length; i++) {
                    if (subreddits.content[i] === subreddit) {
                        resolve(true)
                    }
                }
                if (!found_subr) {
                    subreddits.content.push(subreddit);
                    SubrModel.updateOne({
                        _id: subreddits._id
                    }, subreddits, (err, resp) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(false);
                        }
                    });
                }
            } else {
                let subreddits = new SubrModel({
                    content: [subreddit]
                });

                database.save(subreddits).then(() => {
                    console.log('Initialized subreddits');
                    resolve(false);
                }).catch((err) => {
                    reject(err);
                })
            }
        }).catch((err) => {
            reject(err);
        });
    });
}

module.exports = {
    savePost: savePost
};