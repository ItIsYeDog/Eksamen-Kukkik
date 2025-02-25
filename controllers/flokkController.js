const Flokk = require('../models/Flokk');
const Beiteomrade = require('../models/Beite');
const Reinsdyr = require('../models/Reinsdyr');
const multer = require('multer');
const path = require('path');

// Lager mappe for buemerkebilder hvis den ikke finnes
const fs = require('fs');
const uploadDir = 'public/uploads/buemerker';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurerer hvor bildene skal lagres og hvordan de skal navngis
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/buemerker')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

// Sjekker at opplastet fil er et gyldig bilde
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
        cb(new Error('Invalid file type'), false);
        return;
    }
    cb(null, true);
};

// Setter opp multer med begrensninger for opplasting
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Maks 5MB
    }
}).single('buemerkeBilde');

const flokkController = {
    // Henter registreringsside med liste over beiteområder
    getRegisterPage: async (req, res) => {
        try {
            const beiteomrader = await Beiteomrade.find();
            
            res.render('flokk/register', { 
                beiteomrader,
                error: null,
                oldInput: {}
            });
        } catch (error) {
            console.error('Error fetching beiteomrader:', error);
            res.render('flokk/register', {
                beiteomrader: [],
                error: 'Kunne ikke hente beiteområder',
                oldInput: req.body
            });
        }
    },

    // Håndterer registrering av ny flokk med bilde
    registerFlokk: async (req, res) => {
        upload(req, res, async (err) => {
            try {
                // Håndterer feil ved bildeopplasting
                if (err instanceof multer.MulterError) {
                    throw new Error('Feil ved opplasting: ' + err.message);
                } else if (err) {
                    throw new Error('Kunne ikke laste opp bilde: ' + err.message);
                }

                // Henter data fra skjema
                const { navn, serieinndeling, buemerkeNavn, beiteomradeId } = req.body;
                const buemerkeBilde = req.file ? `/uploads/buemerker/${req.file.filename}` : null;

                // Validerer at bilde er lastet opp
                if (!buemerkeBilde) {
                    throw new Error('Buemerke bilde er påkrevd');
                }

                // Validerer beiteområde
                const beiteomrade = await Beiteomrade.findById(beiteomradeId);
                if (!beiteomrade) {
                    throw new Error('Ugyldig beiteområde valgt');
                }

                // Oppretter ny flokk i databasen
                const flokk = new Flokk({
                    eier: req.userId,
                    navn,
                    serieinndeling,
                    buemerkeNavn,
                    buemerkeBilde,
                    beiteomrade: beiteomradeId
                });

                await flokk.save();
                res.redirect('/');
            } catch (error) {
                // Håndterer feil og viser feilmelding
                const beiteomrader = await Beiteomrade.find();
                res.render('flokk/register', {
                    beiteomrader,
                    error: error.message,
                    oldInput: req.body
                });
            }
        });
    },

    // Henter detaljer om en spesifikk flokk
    getFlokkDetails: async (req, res) => {
        try {
            // Henter flokkinfo med tilhørende data
            const flokk = await Flokk.findById(req.params.id)
                .populate('beiteomrade', 'navn fylker')
                .populate('eier', 'navn epost telefonnummer kontaktsprak');
    
            if (!flokk) {
                return res.status(404).render('error', { 
                    error: 'Flokken ble ikke funnet' 
                });
            }
    
            // Krever innlogging for å se detaljer
            if (!req.userId) {
                return res.redirect('/auth/login');
            }
    
            // Henter alle reinsdyr i flokken
            const reinsdyr = await Reinsdyr.find({ flokk: req.params.id })
                .sort({ serienummer: 1 });
    
            res.render('flokk/details', { 
                flokk,
                reinsdyr,
                beiteomradeNavn: flokk.beiteomrade ? flokk.beiteomrade.navn : 'Ikke tilgjengelig'
            });
        } catch (error) {
            console.error('Error fetching flokk details:', error);
            res.status(500).render('error', { 
                error: 'Kunne ikke hente flokkdetaljer' 
            });
        }
    }
};

module.exports = flokkController;