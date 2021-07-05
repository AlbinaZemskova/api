module.exports = (err, req, res, next) => {
    !err.status && console.error(err);
    res.status(err.status || 500).send({error: err});
};
