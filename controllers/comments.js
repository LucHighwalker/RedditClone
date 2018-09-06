const database = require('./database');

const PostModel = require('../models/post');
const CommentModel = require('../models/comment');

function saveComment(postID, content) {
    var comment = new CommentModel({
        content: content
    });

    return new Promise((resolve, reject) => {
        database.getOne(PostModel, postID).then((post) => {
            post.comments.unshift(comment);
            database.save(post).then(() => {
                resolve();
            }).catch((error) => {
                console.error(error);
                reject("Error saving post comment");
            })
        }).catch((error) => {
            console.error(error);
            reject("Error finding post");
        });
    });
}

module.exports = {
    saveComment: saveComment
};