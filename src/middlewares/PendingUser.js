module.exports = {
    allowPendingSignup(req, res, next) {
        req.allowPendingSignup = true;
        return next();
    }
};