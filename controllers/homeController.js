const Flokk = require('../models/Flokk');

const homeController = {
    getHomePage: async (req, res) => {
        try {
            let userFlokker = [];
            if (req.userId) {
                // Hent brukerens flokker med beiteområde info
                userFlokker = await Flokk.find({ eier: req.userId })
                    .populate('beiteomrade', 'navn')
                    .sort({ navn: 1 });
            }
            
            res.render('index.ejs', { 
                userFlokker,
                success: req.query.success 
            });
        } catch (error) {
            console.error('Error:', error);
            res.render('index.ejs', { 
                userFlokker: [],
                error: 'Kunne ikke hente flokker' 
            });
        }
    }
};

module.exports = homeController;