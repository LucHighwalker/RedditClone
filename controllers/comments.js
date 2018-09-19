const database = require('./database');

const PostModel = require('../models/post');
const UserModel = require('../models/user');
const CommentModel = require('../models/comment');

function saveComment(postID, content, author) {
    return new Promise((resolve, reject) => {
        var comment = new CommentModel({
            content: content
        });

        database.getOne(UserModel, author._id).then((user) => {
            comment.author = user
            user.comments.unshift(comment);

            UserModel.updateOne({
                _id: user._id
            }, user, (err, resp) => {
                if (err) {
                    reject(err);
                } else {
                    database.save(comment).then(() => {
                        database.getOne(PostModel, postID).then((post) => {
                            post.comments.unshift(comment);
                            database.save(post).then(() => {
                                resolve();
                            }).catch((error) => {
                                reject(reject);
                            });
                        }).catch((error) => {
                            reject(error);
                        });
                    }).catch((error) => {
                        console.error(error);
                        reject(error);
                    });
                }
            });
        }).catch((error) => {
            console.error(error);
            reject(error);
        });
    });
}

module.exports = {
    saveComment: saveComment
};