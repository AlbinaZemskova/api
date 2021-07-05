const router = require('express').Router();
const uuid = require('uuid');
const asyncQuery = require('../../utils/asyncQuery').asyncQuery;

const ws = require('ws');
const PL = require('pl-api-websocket-client');

const APP_KEY = require('../../constants').APP_KEY;

router.post('/api/login', async (req, res, next) => {
    const pl = new PL({ WebSocketClass: ws });
    const { plKey } = req.body;

    try {
        const { data } = await pl.request('/stats/info', {
            'user-key': plKey,
            'app-key': APP_KEY,
        });

        const user = {
            id: uuid(),
            pl_user_Id: data['id'],
            firstName: data['first-name'],
            lastName: data['last-name'],
        };

        const getUser = await asyncQuery('SELECT * FROM users WHERE pl_user_Id = ?', [user.pl_user_Id]);

        if (!getUser.length) {
            await asyncQuery('INSERT INTO users SET ?', user);
            res.json(user);
        } else {
            res.json(getUser[0]);
        }
    } catch(e) {
        next(e);
    }
});

module.exports = router;
