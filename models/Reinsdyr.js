const mongoose = require('mongoose');

const reinsdyrSchema = new mongoose.Schema({
    serienummer: {
        type: String,
        required: true,
        unique: true
    },
    navn: {
        type: String,
        required: true
    },
    flokk: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flokk',
        required: true
    },
    fodselsdato: {
        type: Date,
        required: true
    },
    aktivTransaksjon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaksjon',
        default: null
    },
    transaksjonsHistorikk: [{
        fraBuemerkeBilde: String,
        tilBuemerkeBilde: String,
        fraEier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        tilEier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        dato: {
            type: Date,
            default: Date.now
        }
    }]
});

// Auto generer serienummer basert på flokk's serieinndeling
reinsdyrSchema.pre('save', async function(next) {
    if (!this.serienummer) {
        const flokk = await mongoose.model('Flokk').findById(this.flokk);
        if (flokk) {
            const count = await mongoose.model('Reinsdyr').countDocuments({ flokk: this.flokk });
            this.serienummer = `${flokk.serieinndeling}-${(count + 1).toString().padStart(3, '0')}`;
        } else {
            return next(new Error('Flokk does not exist!'));
        }
    }
    next();
});

module.exports = mongoose.model('Reinsdyr', reinsdyrSchema);