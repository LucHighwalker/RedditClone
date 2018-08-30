
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', {
    useNewUrlParser: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('database connected')
});

const postModel = mongoose.model('Post', {
    title: String,
    post: String,
    postID: String,
    userID: String,
});

function getAllPosts () {
    return new Promise((resolve, reject) => {
        postModel.find({}, (error, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
}

function savePost (post) {
    return new Promise((resolve, reject) => {
        post.save((error => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        }));
    });
}


module.exports = {
    postModel: postModel,
    getAllPosts: getAllPosts,
    savePost: savePost
};