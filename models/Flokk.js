const mongoose = require('mongoose');

const flokkSchema = new mongoose.Schema({
    eier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    navn: {
        type: String,
        required: true
    },
    serieinndeling: {
        type: String,
        required: true,
        unique: true
    },
    buemerkeNavn: {
        type: String,
        required: true
    },
    buemerkeBilde: {
        type: String,
        required: true
    },
    beiteomrade: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Beiteomrade',
        required: true
    }
});

flokkSchema.pre('save', async function(next) {
    if (this.isNew) {
        const Beiteomrade = mongoose.model('Beiteomrade');
        await Beiteomrade.findByIdAndUpdate(
            this.beiteomrade,
            { $addToSet: { brukere: this.eier } }
        );
    }
    next();
});

module.exports = mongoose.model('Flokk', flokkSchema);