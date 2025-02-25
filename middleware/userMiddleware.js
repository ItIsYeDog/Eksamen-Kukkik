const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware for å håndtere brukerautentisering
const userMiddleware = async (req, res, next) => {
    // Nullstiller brukerdata for hver forespørsel
    res.locals.user = null;
    res.locals.userId = null;
    const token = req.cookies.token;

    if (token) {
        try {
            // Verifiserer JWT-token med vår hemmelige nøkkel
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Henter brukerdata fra databasen basert på token
            const user = await User.findById(decoded.userId);
            
            // Hvis bruker finnes, setter vi brukerinfo i locals og request
            if (user) {
                res.locals.user = user;
                res.locals.userId = user._id.toString();
                req.userId = user._id.toString();
            }
        } catch (error) {
            // Logger feil ved tokenverifisering eller databasehenting
            console.error('Auth error:', error);
        }
    }
    
    // Fortsetter til neste middleware eller route handler
    next();
};

module.exports = userMiddleware;