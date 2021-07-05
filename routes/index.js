const router = require('express').Router();
const user = require('./user');
const rule = require('./rule');

router.use(user);
router.use(rule);

module.exports = router;
