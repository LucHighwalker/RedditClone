const database = require('./database');

const SubrModel = require('../models/subreddits');

var subreddits = null;

function getSubreddits() {
    return new Promise((resolve, reject) => {
        if (subreddits !== null) {
            resolve(subreddits);
        } else {
            database.getAll(SubrModel).then((resp) => {
                if (resp.length > 0) {
                    let subreddits = resp[0];
                    resolve(subreddits);
                } else {
                    let subreddits = new SubrModel({
                        content: []
                    });
    
                    database.save(subreddits).then(() => {
                        console.log('Initialized subreddits');
                        resolve(subreddits);
                    }).catch((err) => {
                        reject(err);
                    });
                }
            }).catch((err) => {
                reject(err);
            });
        }
    }).catch((error) => {
        console.error(error);
        reject(error);
    });
}

module.exports = {
    getSubreddits: getSubreddits
};