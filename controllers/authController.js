const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
    // Viser registreringssiden
    getRegister: (req, res) => {
        res.render('auth/register');
    },

    // Håndterer brukerregistrering
    register: async (req, res) => {
        try {
            // Henter brukerdata fra skjema
            const { navn, epost, passord, kontaktsprak, telefonnummer } = req.body;

            // Sjekker om eposten allerede er registrert
            const userExists = await User.findOne({ epost });
            if (userExists) {
                return res.render('auth/register', {
                    error: 'En bruker med denne e-postadressen eksisterer allerede',
                    oldInput: req.body
                });
            }

            // Krypterer passordet med bcrypt
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(passord, salt);

            // Oppretter ny bruker i databasen
            const user = new User({
                navn,
                epost,
                passord: hashedPassword,
                kontaktsprak,
                telefonnummer
            });

            await user.save();

            // Lager en JWT for autentisering
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Lagrer token i cookie for sikker autentisering
            res.cookie('token', token, {
                httpOnly: true, // Beskytter mot XSS
                secure: process.env.NODE_ENV === 'production', // HTTPS i produksjon
                maxAge: 24 * 60 * 60 * 1000 // Utløper etter 24 timer
            });

            res.redirect('/');
        } catch (error) {
            console.error('Registration error:', error);
            res.render('auth/register', {
                error: 'Det oppstod en feil under registrering',
                oldInput: req.body
            });
        }
    },

    // Viser innloggingssiden
    getLogin: (req, res) => {
        res.render('auth/login');
    },

    // Håndterer innlogging
    login: async (req, res) => {
        try {
            const { epost, passord } = req.body;

            // Finner bruker i database
            const user = await User.findOne({ epost });
            if (!user) {
                return res.render('auth/login', {
                    error: 'Feil e-post eller passord',
                    oldInput: { epost }
                });
            }

            // Sjekker om passordet er riktig
            const validPassword = await bcrypt.compare(passord, user.passord);
            if (!validPassword) {
                return res.render('auth/login', {
                    error: 'Feil e-post eller passord',
                    oldInput: { epost }
                });
            }

            // Genererer ny JWT for innlogget session
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Lagrer innloggingstoken i cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000
            });

            res.redirect('/');
        } catch (error) {
            console.error('Login error:', error);
            res.render('auth/login', {
                error: 'Det oppstod en feil under innlogging',
                oldInput: req.body
            });
        }
    },

    // Håndterer utlogging ved å slette token
    logout: (req, res) => {
        res.clearCookie('token');
        res.redirect('/');
    }
};

module.exports = authController;