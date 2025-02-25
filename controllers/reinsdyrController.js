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
            res.redirect('/');
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
    }
};

module.exports = reinsdyrController;