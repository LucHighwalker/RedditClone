const database = require('./database');

const SubrModel = require('../models/subreddits');
const UserModel = require('../models/user');

function savePost(post, author) {
    return new Promise((resolve, reject) => {

        checkSubreddits(post.subreddit).then((found) => {
            console.log('Found subreddit: ' + found);
        }).catch((err) => {
            console.error(err);
            console.error('Error checking subreddits!');
        });

        database.getOne(UserModel, author._id).then((user) => {
            user.posts.unshift(post);
            UserModel.updateOne({
                _id: user._id
            }, user, (err, resp) => {
                if (err) {
                    reject(err);
                } else {
                    post.author = author;
            
                    database.save(post).then(() => {
                        resolve(post);
                    }).catch((err) => {
                        reject(err);
                    });
                }
            })
        })
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