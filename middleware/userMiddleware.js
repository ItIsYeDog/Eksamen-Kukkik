const jwt = require('jsonwebtoken');
const User = require('../models/User');

const userMiddleware = async (req, res, next) => {
    res.locals.user = null;
    res.locals.userId = null;
    const token = req.cookies.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);
            if (user) {
                res.locals.user = user;
                res.locals.userId = user._id.toString();
                req.userId = user._id.toString();
            }
        } catch (error) {
            console.error('Auth error:', error);
        }
    }
    next();
};

module.exports = userMiddleware;