
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', {
    useNewUrlParser: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('database connected')
});

const Schema = mongoose.Schema;
const postSchema = new Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    summary: { type: String, required: true }
});
const postModel = mongoose.model('Post', postSchema);

function getAllPosts() {
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

function savePost(post) {
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
    postSchema: postSchema,
    postModel: postModel,
    getAllPosts: getAllPosts,
    savePost: savePost
};