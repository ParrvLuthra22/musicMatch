const Match = require('../models/Match');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Matches Today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const matchesToday = await Match.countDocuments({
            users: userId,
            status: 'matched',
            createdAt: { $gte: startOfDay }
        });

        // 2. Total Matches
        const totalMatches = await Match.countDocuments({
            users: userId,
            status: 'matched'
        });

        // 3. Unread Messages
        // Find conversations where user is participant
        const conversations = await Conversation.find({
            participants: userId
        });

        // Count unread messages sent by others
        let unreadMessages = 0;
        for (const conv of conversations) {
            const unreadCount = conv.messages.filter(msg =>
                msg.sender.toString() !== userId && !msg.read
            ).length;
            unreadMessages += unreadCount;
        }

        // 4. Top Genre (from user's own profile for now, or from matches)
        const user = await User.findById(userId);
        const topGenre = user.topGenres?.[0] || 'Pop';

        res.json({
            matchesToday,
            totalMatches,
            unreadMessages,
            topGenre
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getStats
};
