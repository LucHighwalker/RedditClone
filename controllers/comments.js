const database = require('./database');

const PostModel = require('../models/post');
const CommentModel = require('../models/comment');

function saveComment(postID, content) {
    return new Promise((resolve, reject) => {
        var comment = new CommentModel({
            content: content
        });
    
        database.save(comment).then(() => {
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
    }).catch((error) => {
        console.error(error);
        reject(error);
    });
}

module.exports = {
    saveComment: saveComment
};