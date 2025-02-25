const jwt = require('jsonwebtoken');
const User = require('../models/User');

const userMiddleware = async (req, res, next) => {
    res.locals.user = null;
    const token = req.cookies.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);
            if (user) {
                res.locals.user = user;
            }
        } catch (error) {
            console.error('Auth error:', error);
        }
    }
    next();
};

module.exports = userMiddleware;