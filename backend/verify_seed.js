const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const verifyDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const count = await User.countDocuments();
        console.log(`Total users in database: ${count}`);

        const users = await User.find({}, 'name email');
        console.log('Users found:', users);

        const Conversation = require('./models/Conversation');
        const conversations = await Conversation.find({}).populate('participants', 'name');
        console.log(`Total conversations: ${conversations.length}`);
        conversations.forEach(c => {
            console.log(`Conversation between: ${c.participants.map(p => p.name).join(' & ')}`);
            console.log(`Messages: ${c.messages.length}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error verifying database:', error);
        process.exit(1);
    }
};

verifyDB();
