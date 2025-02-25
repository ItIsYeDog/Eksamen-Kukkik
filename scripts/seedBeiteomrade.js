const mongoose = require('mongoose');
const Beiteomrade = require('../models/Beite');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Liste over alle beiteområder med deres geografiske data
const mockBeiteomrader = [
    {
        navn: 'nordsamisk',
        fylker: ['Troms og Finnmark', 'Nordland'],
        grenser: {
            type: 'Polygon',
            coordinates: [[
                [20.0, 70.0],
                [22.5, 69.5],
                [25.0, 69.0],
                [26.0, 68.2],
                [20.0, 70.0]
            ]]
        }
    },
    {
        navn: 'lulesamisk',
        fylker: ['Nordland'],
        grenser: {
            type: 'Polygon',
            coordinates: [[
                [16.0, 67.5],
                [17.5, 67.2],
                [18.0, 66.8],
                [16.5, 66.5],
                [16.0, 67.5]
            ]]
        }
    },
    {
        navn: 'sørsamisk',
        fylker: ['Trøndelag', 'Nordland'],
        grenser: {
            type: 'Polygon',
            coordinates: [[
                [12.0, 64.5],
                [13.5, 64.8],
                [14.5, 64.3],
                [15.0, 63.5],
                [12.0, 64.5]
            ]]
        }
    },
    {
        navn: 'umesamisk',
        fylker: ['Nordland', 'Trøndelag'],
        grenser: {
            type: 'Polygon',
            coordinates: [[
                [15.0, 65.5],
                [16.5, 65.2],
                [17.0, 64.8],
                [15.5, 64.5],
                [15.0, 65.5]
            ]]
        }
    },
    {
        navn: 'pitesamisk',
        fylker: ['Nordland'],
        grenser: {
            type: 'Polygon',
            coordinates: [[
                [15.5, 66.5],
                [17.0, 66.2],
                [17.5, 65.8],
                [16.0, 65.5],
                [15.5, 66.5]
            ]]
        }
    },
    {
        navn: 'enaresamisk',
        fylker: ['Troms og Finnmark'],
        grenser: {
            type: 'Polygon',
            coordinates: [[
                [26.0, 69.5],
                [27.5, 69.2],
                [28.0, 68.8],
                [26.5, 68.5],
                [26.0, 69.5]
            ]]
        }
    },
    {
        navn: 'skoltsamisk',
        fylker: ['Troms og Finnmark'],
        grenser: {
            type: 'Polygon',
            coordinates: [[
                [28.0, 69.5],
                [29.5, 69.2],
                [30.0, 68.7],
                [28.5, 69.0],
                [28.0, 69.5]
            ]]
        }
    },
    {
        navn: 'akkalasamisk',
        fylker: ['Troms og Finnmark'],
        grenser: {
            type: 'Polygon',
            coordinates: [[
                [30.5, 68.5],
                [32.0, 68.2],
                [32.5, 67.8],
                [31.0, 67.5],
                [30.5, 68.5]
            ]]
        }
    },
    {
        navn: 'kildinsamisk',
        fylker: ['Troms og Finnmark'],
        grenser: {
            type: 'Polygon',
            coordinates: [[
                [32.5, 69.0],
                [34.0, 68.7],
                [34.5, 68.3],
                [33.0, 68.0],
                [32.5, 69.0]
            ]]
        }
    },
    {
        navn: 'tersamisk',
        fylker: ['Troms og Finnmark'],
        grenser: {
            type: 'Polygon',
            coordinates: [[
                [34.5, 67.5],
                [36.0, 67.2],
                [36.5, 66.8],
                [35.0, 66.5],
                [34.5, 67.5]
            ]]
        }
    }
];

// Funksjon for å fylle databasen med beiteområder
async function seedBeiteomrader() {
    try {

        console.log('Trying to connect to:', process.env.MONGO_URI);

        // Kobler til MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Koblet til MongoDB');

        // Sletter alle eksisterende beiteområder
        await Beiteomrade.deleteMany({});
        console.log('Slettet eksisterende beiteområder');

        // Oppretter nye beiteområder
        for (const data of mockBeiteomrader) {
            const beiteomrade = new Beiteomrade(data);
            await beiteomrade.save();
            console.log(`Opprettet beiteområde: ${beiteomrade.navn}`);
        }

        console.log('Ferdig med å fylle inn beiteområder');
        process.exit(0);
    } catch (error) {
        console.error('Feil ved fylling av beiteområder:', error);
        process.exit(1);
    }
}

// Kjører seeding funksjonen
seedBeiteomrader();