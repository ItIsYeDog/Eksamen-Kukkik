const mongoose = require('mongoose');

const beiteomradeSchema = new mongoose.Schema({
    navn: {
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
    fylker: [{
        type: String,
        enum: [
            'Troms og Finnmark',
            'Nordland',
            'Trøndelag',
            'Innlandet',
            'Møre og Romsdal',
            'Vestland'
        ],
        required: true
    }],
    brukere: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    grenser: {
        type: {
            type: String,
            enum: ['Polygon'],
            required: true
        },
        coordinates: {
            type: [[[Number]]], 
            required: true
        }
    }
});

beiteomradeSchema.index({ grenser: '2dsphere' });

module.exports = mongoose.model('Beiteomrade', beiteomradeSchema);