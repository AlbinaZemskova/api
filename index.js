const express = require('express');
const cors = require('cors');

const mysqlConnection = require('./config/db_config');
const router = require('./routes');
const errorHandler = require('./utils/errorHandler');

const port = 5000;
const index = express();

index.use(express.json());
index.use(express.urlencoded({ extended: false }));
index.use(cors({ origin: '*' }));

index.use(router);
index.use(errorHandler);

(async () => {
    await new Promise((resolve, reject) => {
        mysqlConnection.getConnection(function(err, connection) {
            if (err) reject(err); // not connected!

            require('./migrations')();
            resolve();
        });
    });

    index.listen(port, () => console.log(`listen on ${port}`));
})();

module.exports = index;
