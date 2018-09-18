const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subredditSchema = new Schema({
    content: [{
        type: String
    }]
});

module.exports = mongoose.model('Subreddit', subredditSchema);