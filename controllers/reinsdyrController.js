const Reinsdyr = require('../models/Reinsdyr');
const Flokk = require('../models/Flokk');

const reinsdyrController = {
    // Henter registreringssiden og viser brukerens flokker
    getRegisterPage: async (req, res) => {
        try {
            // Henter alle flokker som tilhører innlogget bruker
            const flokker = await Flokk.find({ eier: req.userId });
            
            res.render('reinsdyr/register', { 
                flokker,
                // Viser feilmelding hvis bruker ikke har noen flokker
                error: flokker.length === 0 ? 'Du må først opprette en flokk før du kan registrere reinsdyr' : null,
                oldInput: {}
            });
        } catch (error) {
            console.error('Error:', error);
            res.render('reinsdyr/register', {
                flokker: [],
                error: 'Kunne ikke hente flokker',
                oldInput: {}
            });
        }
    },

    // Håndterer registrering av nytt reinsdyr
    registerReinsdyr: async (req, res) => {
        try {
            // Henter data fra registreringsskjema
            const { navn, flokkId, fodselsdato } = req.body;

            // Validerer at alle påkrevde felt er fylt ut
            if (!navn || !flokkId || !fodselsdato) {
                throw new Error('Mangler påkrevde felt');
            }

            // Sjekker om flokken eksisterer og tilhører brukeren
            const flokk = await Flokk.findById(flokkId);

            if (!flokk) {
                throw new Error('Flokken eksisterer ikke');
            }

            if (flokk.eier.toString() !== req.userId) {
                throw new Error('Du har ikke tilgang til denne flokken');
            }

            // Lager unikt serienummer for reinsdyret
            const count = await Reinsdyr.countDocuments({ flokk: flokkId });
            const serienummer = `${flokk.serieinndeling}-${(count + 1).toString().padStart(3, '0')}`;

            // Oppretter nytt reinsdyr i databasen
            const reinsdyr = new Reinsdyr({
                navn,
                flokk: flokkId,
                fodselsdato: new Date(fodselsdato),
                serienummer
            });

            await reinsdyr.save();
            res.redirect('/?success=reinsdyr');
        } catch (error) {
            // Håndterer feil ved registrering
            console.error('Error registering reinsdyr:', error);
            
            try {
                // Prøver å hente flokker på nytt for å vise skjema med feilmelding
                const flokker = await Flokk.find({ eier: req.userId });
                res.render('reinsdyr/register', {
                    flokker,
                    error: `Kunne ikke registrere reinsdyret: ${error.message}`,
                    oldInput: req.body
                });
            } catch (secondaryError) {
                // Håndterer feil hvis flokker ikke kan hentes
                console.error('Error fetching flokker:', secondaryError);
                res.render('reinsdyr/register', {
                    flokker: [],
                    error: 'En feil oppstod under registrering',
                    oldInput: req.body
                });
            }
        }
    },

    deleteReinsdyr: async (req, res) => {
        try {
            // Finn reinsdyret og populer flokk-informasjon
            const reinsdyr = await Reinsdyr.findById(req.params.id)
                .populate('flokk');
            
            if (!reinsdyr) {
                return res.status(404).json({ 
                    error: 'Reinsdyr ikke funnet' 
                });
            }

            // Sjekk om brukeren har tilgang
            if (!reinsdyr.flokk || reinsdyr.flokk.eier.toString() !== req.userId) {
                return res.status(403).json({ 
                    error: 'Du har ikke tilgang til å slette dette reinsdyret' 
                });
            }

            // Slett reinsdyret
            await Reinsdyr.findByIdAndDelete(req.params.id);
            
            // Send suksessrespons
            res.json({ 
                success: true,
                message: 'Reinsdyr ble slettet' 
            });
        } catch (error) {
            console.error('Delete error:', error);
            res.status(500).json({ 
                error: 'Kunne ikke slette reinsdyr: ' + error.message 
            });
        }
    },
    internOverforing: async (req, res) => {
        try {
            const { reinsdyrId, nyFlokkId } = req.body;

            // Finn reinsdyret og nåværende flokk
            const reinsdyr = await Reinsdyr.findById(reinsdyrId)
                .populate('flokk');

            if (!reinsdyr) {
                return res.status(404).json({ error: 'Reinsdyr ikke funnet' });
            }

            // Sjekk at brukeren eier både gammel og ny flokk
            const [gammelFlokk, nyFlokk] = await Promise.all([
                Flokk.findOne({ _id: reinsdyr.flokk._id, eier: req.userId }),
                Flokk.findOne({ _id: nyFlokkId, eier: req.userId })
            ]);

            if (!gammelFlokk || !nyFlokk) {
                return res.status(403).json({ 
                    error: 'Du har ikke tilgang til en av flokkene' 
                });
            }

            // Oppdater reinsdyret med ny flokk
            reinsdyr.flokk = nyFlokkId;
            await reinsdyr.save();

            res.json({ 
                success: true, 
                message: 'Reinsdyr overført til ny flokk' 
            });
        } catch (error) {
            console.error('Intern overføring error:', error);
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = reinsdyrController;