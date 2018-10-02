const database = require('./database');

const PostModel = require('../models/post');
const UserModel = require('../models/user');
const CommentModel = require('../models/comment');

function saveComment(postID, postSubreddit, content, author) {
    return new Promise((resolve, reject) => {
        var comment = new CommentModel({
            content,
            postID,
            postSubreddit
        });

        // TODO: use user controller
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
                                reject(error);
                            });
                        }).catch((error) => {
                            reject(error);
                        });
                    }).catch((error) => {
                        reject(error);
                    });
                }
            });
        }).catch((error) => {
            reject(error);
        });
    });
}

function saveReply(commentID, content, author) {
    return new Promise((resolve, reject) => {
        database.getOne(CommentModel, commentID).then((comment) => {
            var reply = new CommentModel({
                content
            });

            reply.author = author

            comment.replies.unshift(reply);
            database.save(comment).then(() => {
                resolve();
            }).catch((error) => {
                reject(error);
            });
        }).catch((error) => {
            reject(error);
        });
    });
}

module.exports = {
    saveComment,
    saveReply
};