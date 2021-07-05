const router = require('express').Router();
const getMatch = require('../../utils/getMatch');
const authCheck = require('../../middlewares/auth').authCheck;
const asyncQuery = require('../../utils/asyncQuery').asyncQuery;

const domainNameReg = /\.dev\.itcraft\.co$/;
const numberDomainReg = /10(\.[0-9]){1,3}$/;
const publicOfficeDomainReg = /[a-zA-Z0-9.-]+\.in\.crftgnc\.net$/;

router.post('/api/add-rule', authCheck, async (req, res, next) => {
    try {
        const { officeDomain, publicSubDomain } = req.body;

        const domainName = getMatch(officeDomain, domainNameReg, 0);
        const numberDomain = getMatch(officeDomain, numberDomainReg, 0);

        const checkPublicSubDomain = publicOfficeDomainReg.exec(publicSubDomain);

        if (!(domainName || numberDomain)) {
            throw { status: 400, officeDomain: 'Office domain is not right'};
        }

        if (!checkPublicSubDomain) {
            throw { status: 400, publicSubDomain: 'Public domain is not right'};
        }

        const uniqueCheckResult = await asyncQuery(
            'SELECT publicSubDomain FROM rules WHERE publicSubDomain = ?',
            [publicSubDomain]
        );

        if(uniqueCheckResult.length) {
            throw { status: 400, publicSubDomain: 'Public domain is already exist'};
        }

        const addRule = await asyncQuery('INSERT INTO rules SET ?', req.body);
        const rules = await asyncQuery('SELECT * FROM rules WHERE id = ?', [addRule.insertId]);

        res.send(rules[0]);
    } catch(e) {
        next(e);
    }
});

router.delete('/api/delete-rule', authCheck, async (req, res, next) => {
    try {
        const { ruleId } = req.body;

        await asyncQuery('DELETE FROM rules WHERE id = ?', [ruleId]);
        res.sendStatus(200);
    } catch(e) {
        next(e);
    }
});

router.get('/api/load-user-rules', authCheck, async (req, res, next) => {
    try {
        const { id } = req.query;

        const userRules = await asyncQuery('SELECT * FROM rules WHERE user_id = ?', [id]);
        res.send(userRules);
    } catch(e) {
        next(e);
    }
});

router.get('/load-rules', async (req, res, next) => {
    try {
        const rules = await asyncQuery('SELECT * FROM rules');
        res.send(rules);
    } catch(e) {
        next(e);
    }
});

module.exports = router;
