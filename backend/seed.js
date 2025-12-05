const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const users = [
    {
        name: 'Alice Rocker',
        email: 'alice@example.com',
        password: 'password123',
        age: 25,
        gender: 'female',
        bio: 'I live for classic rock and indie vibes. Looking for concert buddies!',
        location: {
            type: 'Point',
            coordinates: [-73.935242, 40.730610] // New York
        },
        topGenres: ['rock', 'indie', 'alternative'],
        topArtists: [
            { name: 'The Strokes', id: '0epOFNiUfyON9EYx7Tpr6V', genres: ['garage rock', 'indie rock'] },
            { name: 'Arctic Monkeys', id: '7Ln80lUS6He07XvHI8qqHH', genres: ['garage rock', 'indie rock'] }
        ],
        listeningStats: {
            danceability: 0.6,
            energy: 0.8,
            valence: 0.5,
            acousticness: 0.2
        },
        preferences: {
            ageRange: { min: 21, max: 35 },
            distance: 50,
            genderPreference: ['male', 'female', 'non-binary']
        }
    },
    {
        name: 'Bob Pop',
        email: 'bob@example.com',
        password: 'password123',
        age: 28,
        gender: 'male',
        bio: 'Pop music enthusiast. Taylor Swift is queen.',
        location: {
            type: 'Point',
            coordinates: [-74.0060, 40.7128] // Manhattan
        },
        topGenres: ['pop', 'dance pop'],
        topArtists: [
            { name: 'Taylor Swift', id: '06HL4z0CvFAxyc27GXpf02', genres: ['pop'] },
            { name: 'Dua Lipa', id: '6M2wZ9GZgrQXHCFfjv46we', genres: ['pop', 'dance pop'] }
        ],
        listeningStats: {
            danceability: 0.8,
            energy: 0.7,
            valence: 0.8,
            acousticness: 0.3
        },
        preferences: {
            ageRange: { min: 20, max: 30 },
            distance: 20,
            genderPreference: ['female']
        }
    },
    {
        name: 'Charlie Jazz',
        email: 'charlie@example.com',
        password: 'password123',
        age: 32,
        gender: 'non-binary',
        bio: 'Smooth jazz and coffee. Let\'s vibe.',
        location: {
            type: 'Point',
            coordinates: [-73.9442, 40.6782] // Brooklyn
        },
        topGenres: ['jazz', 'blues', 'soul'],
        topArtists: [
            { name: 'Miles Davis', id: '0kbYTNQb4Pb1rPBbVxYml7', genres: ['jazz', 'cool jazz'] },
            { name: 'John Coltrane', id: '2hGh5VOeeqimQFxqXvfCUf', genres: ['jazz', 'free jazz'] }
        ],
        listeningStats: {
            danceability: 0.4,
            energy: 0.4,
            valence: 0.6,
            acousticness: 0.8
        },
        preferences: {
            ageRange: { min: 25, max: 40 },
            distance: 30,
            genderPreference: ['male', 'female', 'non-binary', 'other']
        }
    },
    {
        name: 'Diana Techno',
        email: 'diana@example.com',
        password: 'password123',
        age: 24,
        gender: 'female',
        bio: 'Techno all night long. Berlin vibes in NY.',
        location: {
            type: 'Point',
            coordinates: [-73.9262, 40.7769] // Queens
        },
        topGenres: ['techno', 'house', 'electronic'],
        topArtists: [
            { name: 'Charlotte de Witte', id: '1l2ekx5skC4gam85KT3FzB', genres: ['techno'] },
            { name: 'Amelie Lens', id: '55M6LC1M00rCMZ4T7gL8nJ', genres: ['techno'] }
        ],
        listeningStats: {
            danceability: 0.9,
            energy: 0.9,
            valence: 0.3,
            acousticness: 0.1
        },
        preferences: {
            ageRange: { min: 18, max: 30 },
            distance: 100,
            genderPreference: ['male', 'female']
        }
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Optional: Clear existing users (comment out if you want to keep them)
        // await User.deleteMany({});
        // console.log('Existing users cleared');

        for (const user of users) {
            // Check if user exists
            const exists = await User.findOne({ email: user.email });
            if (exists) {
                console.log(`User ${user.email} already exists`);
                continue;
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            user.passwordHash = await bcrypt.hash(user.password, salt);
            delete user.password; // Remove plain text password

            await User.create(user);
            console.log(`Created user: ${user.name}`);
        }

        // Seed Conversations
        const Conversation = require('./models/Conversation');

        // Fetch users to get their IDs
        const dbUsers = await User.find({});
        const userMap = {};
        dbUsers.forEach(u => userMap[u.email] = u._id);

        if (dbUsers.length >= 2) {
            // Alice and Bob
            const aliceId = userMap['alice@example.com'];
            const bobId = userMap['bob@example.com'];

            if (aliceId && bobId) {
                const existingConv = await Conversation.findOne({
                    participants: { $all: [aliceId, bobId] }
                });

                if (!existingConv) {
                    await Conversation.create({
                        participants: [aliceId, bobId],
                        messages: [
                            { sender: aliceId, content: 'Hey Bob! Saw you like Taylor Swift too.', timestamp: new Date(Date.now() - 86400000) },
                            { sender: bobId, content: 'Yeah! She is amazing. Going to the concert?', timestamp: new Date(Date.now() - 80000000) }
                        ],
                        lastMessage: {
                            content: 'Yeah! She is amazing. Going to the concert?',
                            sender: bobId,
                            timestamp: new Date(Date.now() - 80000000),
                            read: false
                        }
                    });
                    console.log('Created conversation between Alice and Bob');
                }
            }

            // Charlie and Diana
            const charlieId = userMap['charlie@example.com'];
            const dianaId = userMap['diana@example.com'];

            if (charlieId && dianaId) {
                const existingConv = await Conversation.findOne({
                    participants: { $all: [charlieId, dianaId] }
                });

                if (!existingConv) {
                    await Conversation.create({
                        participants: [charlieId, dianaId],
                        messages: [
                            { sender: charlieId, content: 'Techno is interesting. Any recommendations?', timestamp: new Date(Date.now() - 100000000) },
                            { sender: dianaId, content: 'You should check out Charlotte de Witte!', timestamp: new Date(Date.now() - 90000000) }
                        ],
                        lastMessage: {
                            content: 'You should check out Charlotte de Witte!',
                            sender: dianaId,
                            timestamp: new Date(Date.now() - 90000000),
                            read: false
                        }
                    });
                    console.log('Created conversation between Charlie and Diana');
                }
            }
        }

        console.log('Seeding complete');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
