const mongoose = require('mongoose');

const transaksjonSchema = new mongoose.Schema({
    reinsdyr: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reinsdyr',
        required: true
    },
    fraEier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tilEier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    målFlokk: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flokk'
    },
    status: {
        type: String,
        enum: ['ventende', 'godkjent_av_ny_eier', 'avslatt_av_ny_eier', 'fullfort', 'avslatt'],
        default: 'ventende'
    },
    opprettetDato: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaksjon', transaksjonSchema);