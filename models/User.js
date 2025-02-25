const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
    navn: {
        type: String,
        required: true
    },
    uniktNummer: {
        type: String,
        default: uuidv4,
        unique: true
    },
    epost: {
        type: String,
        required: true,
        unique: true
    },
    passord: {
        type: String,
        required: true
    },
    kontaktsprak: {
        type: String,
        enum: [
            'nordsamisk',
            'lulesamisk', 
            'sørsamisk',
            'umesamisk',
            'pitesamisk',
            'enaresamisk',
            'skoltsamisk',
            'akkalasamisk',
            'kildinsamisk',
            'tersamisk'
        ],
        required: true
    },
    telefonnummer: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                // Validerer mobil nummere som: +47 123 45 678 or +46 123 456 789
                return /^\+\d{2,3}[\s-]?\d{3}[\s-]?\d{2,3}[\s-]?\d{3}$/.test(v);
            },
            message: props => `${props.value} er ikke et gyldig telefonnummer! Bruk format: +XX XXX XX XXX`
        }
    }
});

userSchema.pre('save', function(next) {
    if (this.telefonnummer) {
        this.telefonnummer = this.telefonnummer.replace(/[^\+\d]/g, '');
        this.telefonnummer = this.telefonnummer.replace(/(\+\d{2,3})(\d{3})(\d{2,3})(\d{3})/, '$1 $2 $3 $4');
    }
    next();
});

module.exports = mongoose.model('User', userSchema);