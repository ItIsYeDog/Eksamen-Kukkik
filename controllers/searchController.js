const Reinsdyr = require('../models/Reinsdyr');
const Flokk = require('../models/Flokk');

const searchController = {
    // Håndterer søk etter både reinsdyr og flokker
    search: async (req, res) => {
        try {
            // Henter søkeord fra query parameter
            const query = req.query.q;

            // Returnerer tomme lister hvis ingen søkeord er gitt
            if (!query) {
                return res.json({ reinsdyr: [], flokker: [] });
            }

            // Søker etter reinsdyr basert på serienummer eller navn
            // Bruker regex for å matche fra starten av teksten (^)
            const reinsdyr = await Reinsdyr.find({
                $or: [
                    { serienummer: { $regex: `^${query}`, $options: 'i' } }, // 'i' gjør søket case-insensitive
                    { navn: { $regex: `^${query}`, $options: 'i' } }
                ]
            }).populate({
                // Henter tilknyttet flokkinfo
                path: 'flokk',
                select: 'navn serieinndeling buemerkeNavn beiteomrade',
                // Henter også beiteområdeinfo for flokken
                populate: {
                    path: 'beiteomrade',
                    model: 'Beiteomrade',
                    select: 'navn fylker'
                }
            });

            // Søker etter flokker basert på navn eller serieinndeling
            const flokker = await Flokk.find({
                $or: [
                    { navn: { $regex: `^${query}`, $options: 'i' } },
                    { serieinndeling: { $regex: `^${query}`, $options: 'i' } }
                ]
            })
            // Henter tilknyttet beiteområde- og eierinfo
            .populate('beiteomrade', 'navn fylker')
            .populate('eier', 'navn');

            // Sender resultatene som JSON
            res.json({ reinsdyr, flokker });
        } catch (error) {
            // Håndterer og logger eventuelle feil
            console.error('Search error:', error);
            res.status(500).json({ 
                error: 'Kunne ikke utføre søk',
                details: error.message 
            });
        }
    }
};

module.exports = searchController;