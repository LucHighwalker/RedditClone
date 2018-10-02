
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', {
    useNewUrlParser: true
});
mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('database connected');
});

function getOne(model, id) {
    return new Promise((resolve, reject) => {
        model.findById(id, (error, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
}

function getAll(model, search = null, subreddit = null) {
    var query = {}
    
    if (search) {
        query.$text = {
                $search: search
            }
    }

    if (subreddit) {
        query.subreddit = subreddit;
    }

    return new Promise((resolve, reject) => {
        model.find(query, (error, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
}

function save(model) {
    return new Promise((resolve, reject) => {
        const now = new Date();
        model.updatedAt = now;
        if (!model.createdAt) {
            model.createdAt = now;
        }

        model.save((error) => {
            if (error) {
                reject(error);
            } else {
                resolve(model);
            }
        });
    });
}

function del(model, id) {
    return new Promise((resolve, reject) => {
        model.deleteOne({ _id: id }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function populateOne(model, id, populate) {
    return new Promise((resolve, reject) => {
        model.findById(id).populate(populate).exec((error, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
}

// needs refactor
function populateTwo(model, id, populate1, populate2) {
    return new Promise((resolve, reject) => {
        model.findById(id).populate(populate1).populate(populate2).exec((error, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
}


module.exports = {
    getOne,
    getAll,
    save,
    del,
    populateOne,
    populateTwo
};