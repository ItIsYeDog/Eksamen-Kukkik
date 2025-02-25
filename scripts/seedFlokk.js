const mongoose = require('mongoose');
const Flokk = require('../models/Flokk');
const User = require('../Models/User');
const Beiteomrade = require('../models/Beite');
require('dotenv').config();

const mockFlokker = [
    {
        navn: "Nordflokken",
        serieinndeling: "NF",
        buemerkeNavn: "Halvmåne Nord",
        buemerkeBilde: "/images/buemerker/halvmane-nord.png",
        beiteomradeNavn: "nordsamisk"
    },
    {
        navn: "Sørflokken",
        serieinndeling: "SF",
        buemerkeNavn: "Stjerne Sør",
        buemerkeBilde: "/images/buemerker/stjerne-sor.png",
        beiteomradeNavn: "sørsamisk"
    },
    {
        navn: "Østflokken",
        serieinndeling: "OF",
        buemerkeNavn: "Kryss Øst",
        buemerkeBilde: "/images/buemerker/kryss-ost.png",
        beiteomradeNavn: "skoltsamisk"
    }
];

async function seedFlokker() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const user = await User.findOne();
        if (!user) {
            throw new Error('No users found in database');
        }

        for (const flokkData of mockFlokker) {
            const beiteomrade = await Beiteomrade.findOne({ 
                navn: flokkData.beiteomradeNavn 
            });

            if (!beiteomrade) {
                console.log(`No beiteområde found for ${flokkData.beiteomradeNavn}`);
                continue;
            }

            const flokk = new Flokk({
                eier: user._id,
                navn: flokkData.navn,
                serieinndeling: flokkData.serieinndeling,
                buemerkeNavn: flokkData.buemerkeNavn,
                buemerkeBilde: flokkData.buemerkeBilde,
                beiteomrade: beiteomrade._id
            });

            await flokk.save();
            console.log(`Created flokk: ${flokk.navn}`);
        }

        console.log('Finished seeding flokker');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding flokker:', error);
        process.exit(1);
    }
}

seedFlokker();