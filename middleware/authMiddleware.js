const jwt = require('jsonwebtoken');

const authMiddleware = {
    isAuth: (req, res, next) => {
        const token = req.cookies.token;
        //console.log('Token:', token); // debug

        if (!token) {
            return res.redirect('/auth/login');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.userId;
            //console.log('Decoded userId:', req.userId); // debug
            next();
        } catch (error) {
            console.error('Auth error:', error);
            res.clearCookie('token');
            res.redirect('/auth/login');
        }
    }
};

module.exports = authMiddleware;