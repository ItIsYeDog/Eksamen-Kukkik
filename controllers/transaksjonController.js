const Transaksjon = require('../models/Transaksjon');
const User = require('../models/User');
const Reinsdyr = require('../models/Reinsdyr');
const Flokk = require('../models/Flokk');

const transaksjonController = {
    // Starter en ny transaksjon
    startTransaksjon: async (req, res) => {
        try {
            const { reinsdyrId, nyEierEpost } = req.body;

            // Finn ny eier
            const nyEier = await User.findOne({ epost: nyEierEpost });
            if (!nyEier) {
                return res.status(404).json({ error: 'Fant ikke bruker med denne e-postadressen' });
            }

            // Finn reinsdyret og sjekk eierskap
            const reinsdyr = await Reinsdyr.findById(reinsdyrId).populate('flokk');
            if (!reinsdyr) {
                return res.status(404).json({ error: 'Reinsdyr ikke funnet' });
            }

            if (reinsdyr.flokk.eier.toString() !== req.userId) {
                return res.status(403).json({ error: 'Du har ikke tilgang til dette reinsdyret' });
            }

            // Opprett transaksjon
            const transaksjon = new Transaksjon({
                reinsdyr: reinsdyrId,
                fraEier: req.userId,
                tilEier: nyEier._id
            });

            await transaksjon.save();

            // Oppdater reinsdyr med aktiv transaksjon
            reinsdyr.aktivTransaksjon = transaksjon._id;
            await reinsdyr.save();

            console.log(`Ny overføringsforespørsel sendt til ${nyEier.epost}`);

            res.json({ 
                success: true, 
                message: 'Overføringsforespørsel sendt til ny eier' 
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    håndterValgAvFlokk: async (req, res) => {
        try {
            const { transaksjonId, flokkId } = req.body;
            
            // Finn og valider transaksjonen
            const transaksjon = await Transaksjon.findById(transaksjonId)
                .populate('reinsdyr')
                .populate('fraEier')
                .populate('tilEier');

            if (!transaksjon || transaksjon.tilEier._id.toString() !== req.userId) {
                return res.status(403).json({ error: 'Ingen tilgang' });
            }

            // Finn og valider målflokken
            const målFlokk = await Flokk.findOne({
                _id: flokkId,
                eier: req.userId
            });

            if (!målFlokk) {
                return res.status(404).json({ error: 'Flokken ble ikke funnet' });
            }

            // Oppdater transaksjonen med valgt målflokk
            transaksjon.målFlokk = målFlokk._id;
            transaksjon.status = 'godkjent_av_ny_eier';
            await transaksjon.save();

            res.redirect('/transaksjoner/mine');
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // Håndterer respons fra ny eier
    håndterNyEierRespons: async (req, res) => {
        try {
            const { transaksjonId, godkjent } = req.body;
            const transaksjon = await Transaksjon.findById(transaksjonId);

            if (!transaksjon || transaksjon.tilEier.toString() !== req.userId) {
                return res.status(403).json({ error: 'Ingen tilgang' });
            }

            transaksjon.status = godkjent ? 'godkjent_av_ny_eier' : 'avslatt_av_ny_eier';
            await transaksjon.save();

            if (!godkjent) {
                // Fjern referanse til transaksjonen fra reinsdyret
                await Reinsdyr.findByIdAndUpdate(transaksjon.reinsdyr, {
                    $unset: { aktivTransaksjon: "" }
                });
            }

            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Håndterer endelig bekreftelse fra gammel eier
    håndterEndeligBekreftelse: async (req, res) => {
        try {
            const { transaksjonId, godkjent } = req.body;
            
            const transaksjon = await Transaksjon.findById(transaksjonId)
                .populate('reinsdyr')
                .populate('målFlokk');

            if (!transaksjon || transaksjon.fraEier.toString() !== req.userId) {
                return res.status(403).json({ error: 'Ingen tilgang' });
            }

            if (godkjent) {
                // Sjekk at målflokk er valgt
                if (!transaksjon.målFlokk) {
                    return res.status(400).json({ error: 'Ingen målflokk er valgt' });
                }

                // Overfør reinsdyr til ny flokk
                await Reinsdyr.findByIdAndUpdate(transaksjon.reinsdyr._id, {
                    flokk: transaksjon.målFlokk._id,
                    $unset: { aktivTransaksjon: "" }
                });

                transaksjon.status = 'fullfort';
            } else {
                // Avslå overføring
                await Reinsdyr.findByIdAndUpdate(transaksjon.reinsdyr._id, {
                    $unset: { aktivTransaksjon: "" }
                });
                transaksjon.status = 'avslatt';
            }

            await transaksjon.save();
            res.json({ success: true });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // Henter aktive transaksjoner for en bruker
    getMineTranaksjoner: async (req, res) => {
        try {
            const transaksjoner = await Transaksjon.find({
                $or: [
                    { fraEier: req.userId },
                    { tilEier: req.userId }
                ]
            })
            .populate('reinsdyr')
            .populate('fraEier', 'navn epost')
            .populate('tilEier', 'navn epost')
            .sort('-opprettetDato');
    
            // Hent brukerens flokker for valgmuligheter
            const brukerFlokker = await Flokk.find({ 
                eier: req.userId 
            }).sort('navn');
    
            res.render('transaksjoner', { 
                transaksjoner,
                brukerFlokker
            });
        } catch (error) {
            res.status(500).render('error', { 
                error: error.message 
            });
        }
    },
};

module.exports = transaksjonController;