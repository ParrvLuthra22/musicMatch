const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Match = require('./models/Match');
const Conversation = require('./models/Conversation');

dotenv.config();

const seedE2E = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Cleanup previous E2E users
        await User.deleteMany({ email: { $in: ['alice@test.com', 'bob@test.com'] } });
        console.log('Cleaned up old users');

        // Create Alice
        const alice = new User({
            name: 'Alice Wonder',
            email: 'alice@test.com',
            password: 'password123', // Will be hashed by pre-save
            age: 24,
            gender: 'female',
            preferences: {
                genderPreference: 'everyone', // Ensure they can see each other
                ageRange: { min: 18, max: 50 },
                distance: 100
            },
            location: {
                type: 'Point',
                coordinates: [-73.935242, 40.730610] // NYC
            },
            photos: ['https://randomuser.me/api/portraits/women/1.jpg'],
            topArtists: [
                { name: 'The Weeknd', genres: ['pop', 'r&b'], popularity: 95 }
            ],
            audioFeatures: {
                danceability: 0.8,
                energy: 0.7,
                valence: 0.6
            }
        });
        await alice.save();
        console.log('Created Alice');

        // Create Bob
        const bob = new User({
            name: 'Bob Builder',
            email: 'bob@test.com',
            password: 'password123',
            age: 26,
            gender: 'male',
            preferences: {
                genderPreference: 'everyone',
                ageRange: { min: 18, max: 50 },
                distance: 100
            },
            location: {
                type: 'Point',
                coordinates: [-73.935242, 40.730610] // NYC
            },
            photos: ['https://randomuser.me/api/portraits/men/1.jpg'],
            topArtists: [
                { name: 'Daft Punk', genres: ['electronic', 'funk'], popularity: 90 }
            ],
            audioFeatures: {
                danceability: 0.85,
                energy: 0.75,
                valence: 0.65
            }
        });
        await bob.save();
        console.log('Created Bob');

        // Create Match (Mutual Like)
        const match = new Match({
            users: [alice._id, bob._id],
            score: 85,
            breakdown: {
                musicScore: 80,
                artistOverlap: 10,
                genreOverlap: 70,
                featureSimilarity: 90
            },
            status: 'matched'
        });
        await match.save();
        console.log('Created Match between Alice and Bob');

        // Create Conversation (Empty for now)
        const conversation = new Conversation({
            participants: [alice._id, bob._id],
            matchId: match._id
        });
        await conversation.save();
        console.log('Created Conversation');

        console.log('E2E Seed Complete!');
        process.exit(0);

    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
};

seedE2E();
