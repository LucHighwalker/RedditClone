
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', {
    useNewUrlParser: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('database connected')
});

function find(model, id) {
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

function getAll(model) {
    return new Promise((resolve, reject) => {
        model.find({}, (error, response) => {
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
        model.updatedAt = now
        if (!model.createdAt) {
            model.createdAt = now
        }

        model.save((error => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        }));  
    });
}


module.exports = {
    find: find,
    getAll: getAll,
    save: save
};