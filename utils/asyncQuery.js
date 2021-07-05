const db = require('../config/db_config');

module.exports = {
    asyncQuery: (...args) => new Promise((resolve, reject) => {
        db.query(...args, (err, result) => {
            if (err) reject(err);

            resolve(result);
        })
    })
};
