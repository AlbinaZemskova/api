const asyncQuery = require('../utils/asyncQuery').asyncQuery;

module.exports = {
    execute: () => asyncQuery('ALTER TABLE rules CHANGE users_id user_id VARCHAR(45)'),
    version: 1
};
