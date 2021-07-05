const ws = require('ws');
const PL = require('pl-api-websocket-client');
const asyncQuery = require('../../utils/asyncQuery').asyncQuery;

const APP_KEY = require('../../constants').APP_KEY;

const authCheck = async (req, res, next) => {
    const pl = new PL({ WebSocketClass: ws });

    const { pluserkey } = req.headers;
    const id = req.body.user_id || req.query.id;

    try {
        const { data: user } = await pl.request('/stats/info', {
            'user-key': pluserkey,
            'app-key': APP_KEY,
        });

        const result = await asyncQuery('SELECT * FROM users WHERE id = ?', [id]);

        if(+user["id"] !== result[0].pl_user_Id) {
            throw { status: 401 };
        }

        next();
    } catch(e) {
        next(e);
    }
};

module.exports = {
    authCheck,
};
