const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Transaksjon = require('../models/Transaksjon');

// Middleware funksjon som kjører på hver request
const userMiddleware = async (req, res, next) => {
    try {
        // Setter standardverdier for brukerdata
        // Disse verdiene er tilgjengelige i alle views
        res.locals.user = null;          // Bruker-objekt
        res.locals.userId = null;        // Bruker-ID
        res.locals.transaksjoner = [];   // Liste over aktive transaksjoner
        res.locals.unreadTransactions = 0; // Antall uleste transaksjoner
        
        // Henter token fra cookies
        const token = req.cookies.token;

        // Hvis token eksisterer, prøv å verifisere brukeren
        if (token) {
            // Dekoder med jwt secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Henter bruker fra database basert på ID i token
            const user = await User.findById(decoded.userId);
            
            // Hvis bruker ble funnet
            if (user) {
                // Lagrer brukerinfo i res.locals for tilgang i views
                res.locals.user = user;
                res.locals.userId = user._id.toString();
                req.userId = user._id.toString();

                // Henter aktive transaksjoner for brukeren
                // Dette inkluderer både innkommende og utgående transaksjoner
                const transaksjoner = await Transaksjon.find({
                    $or: [
                        // Henter transaksjoner der brukeren er mottaker og status er 'ventende'
                        { tilEier: user._id, status: 'ventende' },
                        // Eller der brukeren er avsender og den nye eieren har godkjent
                        { fraEier: user._id, status: 'godkjent_av_ny_eier' }
                    ]
                })
                // Fyller inn, sorterer og begrenser antall transaksjoner
                .populate('reinsdyr')     
                .populate('fraEier', 'navn')  
                .populate('tilEier', 'navn')  
                .sort('-opprettetDato')   
                .limit(5);                

                // Lagrer transaksjonene i res.locals for tilgang i views
                res.locals.transaksjoner = transaksjoner;
                // Setter antall uleste transaksjoner
                res.locals.unreadTransactions = transaksjoner.length;
            }
        }
        // Fortsetter
        next();
    } catch (error) {
        // Logger eventuelle feil
        console.error('Middleware error:', error);
        // Fortsetter uten brukerdata ved feil
        next();
    }
};

module.exports = userMiddleware;