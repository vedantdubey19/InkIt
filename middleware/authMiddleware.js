module.exports = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    req.flash('error', 'You must be logged in to do that!');
    res.redirect('/auth/login');
};
