const fs = require('fs');
const asyncQuery = require('../utils/asyncQuery').asyncQuery;

const migrations = [];

module.exports = async () => {
    fs.readdirSync(__dirname + '/').forEach((file) => {
        if (file.match(/\.js$/) !== null && file !== 'index.js') {
            migrations.push(require('./' + file));
        }
    });

    migrations.sort((prev, next) => prev.version - next.version);

    try {
        asyncQuery('CREATE TABLE IF NOT EXISTS db_versions (version INT(11))');

        const version = await asyncQuery('SELECT version FROM RN_Tunnel.db_versions');
        let currentVersion;

        if(!version.length) {
            asyncQuery('INSERT INTO db_versions (version) VALUE(0)');
            currentVersion = 0;
        } else {
            currentVersion = version[0].version;
        }

        for(let i = 0; i < migrations.length; i++) {
            if (currentVersion < migrations[i].version) {
                try {
                    await migrations[i].execute();
                    await asyncQuery(
                        'UPDATE db_versions SET version=?',
                        [migrations[i].version]
                    );
                } catch (e) {
                    console.error(e);
                }
            }
        }
   } catch (e) {
        console.error(e);
   }
};
