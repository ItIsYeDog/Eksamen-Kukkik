const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const path = require('path');
const User = require('./models/User');
const Flokk = require('./models/Flokk');
const Reinsdyr = require('./models/Reinsdyr');
const Beiteomrade = require('./models/Beite');

require('dotenv').config();

const generatePhoneNumber = () => {
    const n1 = Math.floor(100 + Math.random() * 900);
    const n2 = Math.floor(10 + Math.random() * 90);
    const n3 = Math.floor(100 + Math.random() * 900);
    return `+47 ${n1} ${n2} ${n3}`;
};

const generateSerieinndeling = (userIndex, flokkIndex) => {
    const prefixes = ['NF', 'SF', 'ØF', 'VF', 'BF', 'DF'];
    return `${prefixes[userIndex % prefixes.length]}${flokkIndex + 1}`;
};

const createUser = async (name, email, index) => {
    const hashedPassword = await bcryptjs.hash('password123', 10);
    return User.create({
        navn: name,
        epost: email,
        passord: hashedPassword,
        kontaktsprak: 'lulesamisk',
        telefonnummer: generatePhoneNumber()
    });
};

const seedData = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        await Promise.all([
            User.deleteMany({}),
            Flokk.deleteMany({}),
            Reinsdyr.deleteMany({})
        ]);
        console.log('Cleared existing data');

        const users = await Promise.all([
            createUser('Ole Nordmann', 'ole@example.com', 0),
            createUser('Anna Samisk', 'anna@example.com', 1)
        ]);
        console.log('Created users');

        for (let i = 0; i < users.length; i++) {
            await createFlocksForUser(users[i], i);
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

const createFlocksForUser = async (user, userIndex) => {
    const beiteomrader = await Beiteomrade.find();
    const flockCount = Math.floor(Math.random() * 3) + 2;

    for (let i = 0; i < flockCount; i++) {
        const serieinndeling = generateSerieinndeling(userIndex, i);
        const flockName = `${user.navn}s Flokk ${i + 1}`;
        
        const flock = await Flokk.create({
            navn: flockName,
            eier: user._id,
            serieinndeling: serieinndeling,
            buemerkeNavn: `Buemerke ${flockName}`,
            buemerkeBilde: '/images/default-buemerke.png',
            beiteomrade: beiteomrader[Math.floor(Math.random() * beiteomrader.length)]._id
        });

        await createReindeerForFlock(flock);
        console.log(`Created flock: ${flockName} with serieinndeling: ${serieinndeling}`);
    }
};

const createReindeerForFlock = async (flock) => {
    const reindeerNames = [
        'Blitz', 'Rudolph', 'Storm', 'Luna', 'Stella', 'Thor',
        'Odin', 'Freya', 'Loki', 'Njord', 'Tyr', 'Balder'
    ];

    const reindeerCount = Math.floor(Math.random() * 15) + 5;

    for (let i = 0; i < reindeerCount; i++) {
        const reinsdyr = await Reinsdyr.create({
            navn: reindeerNames[Math.floor(Math.random() * reindeerNames.length)],
            serienummer: `${flock.serieinndeling}-${(i + 1).toString().padStart(3, '0')}`,
            flokk: flock._id,
            fodselsdato: new Date(
                2020 + Math.floor(Math.random() * 4),
                Math.floor(Math.random() * 12),
                Math.floor(Math.random() * 28) + 1
            )
        });
        console.log(`Created reindeer: ${reinsdyr.navn} (${reinsdyr.serienummer})`);
    }
};

seedData();