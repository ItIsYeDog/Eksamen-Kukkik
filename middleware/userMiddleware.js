const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Transaksjon = require('../models/Transaksjon');

const userMiddleware = async (req, res, next) => {
    try {
        // Initialize default values
        res.locals.user = null;
        res.locals.userId = null;
        res.locals.transaksjoner = [];
        res.locals.unreadTransactions = 0;
        
        const token = req.cookies.token;

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);
            
            if (user) {
                res.locals.user = user;
                res.locals.userId = user._id.toString();
                req.userId = user._id.toString();

                // Fetch active transactions
                const transaksjoner = await Transaksjon.find({
                    $or: [
                        { tilEier: user._id, status: 'ventende' },
                        { fraEier: user._id, status: 'godkjent_av_ny_eier' }
                    ]
                })
                .populate('reinsdyr')
                .populate('fraEier', 'navn')
                .populate('tilEier', 'navn')
                .sort('-opprettetDato')
                .limit(5);

                res.locals.transaksjoner = transaksjoner;
                res.locals.unreadTransactions = transaksjoner.length;
            }
        }
        next();
    } catch (error) {
        console.error('Middleware error:', error);
        // Continue without transaction data
        next();
    }
};

module.exports = userMiddleware;