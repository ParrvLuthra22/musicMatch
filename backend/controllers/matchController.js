const User = require('../models/User');
const Match = require('../models/Match');
const matchingService = require('../services/matchingService');

const getDiscoveryMatches = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);

        const existingMatches = await Match.find({
            users: currentUser._id
        }).select('users');

        const interactedUserIds = existingMatches.flatMap(m => m.users.map(u => u.toString()));
        interactedUserIds.push(currentUser._id.toString());

        const potentialMatches = await User.find({
            _id: { $nin: interactedUserIds },
        }).limit(10);

        const scoredMatches = potentialMatches.map(user => {
            const { score, breakdown } = matchingService.calculateMatchScore(currentUser, user);
            return {
                user,
                score,
                breakdown
            };
        });

        scoredMatches.sort((a, b) => b.score - a.score);

        res.json(scoredMatches);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get matches' });
    }
};

const handleMatchAction = async (req, res) => {
    const { targetUserId, action } = req.body;
    const currentUserId = req.user._id;

    try {
        if (action === 'pass') {
            await Match.create({
                users: [currentUserId, targetUserId],
                score: 0,
                status: 'passed'
            });
            return res.json({ status: 'passed' });
        }

        if (action === 'like') {
            const existingMatch = await Match.findOne({
                users: { $all: [currentUserId, targetUserId] },
                status: 'pending'
            });

            const currentUser = await User.findById(currentUserId);
            const targetUser = await User.findById(targetUserId);
            const { score, breakdown } = matchingService.calculateMatchScore(currentUser, targetUser);

            const isMatch = score > 75;

            const match = await Match.create({
                users: [currentUserId, targetUserId],
                score,
                breakdown,
                status: isMatch ? 'matched' : 'pending'
            });

            return res.json({
                status: isMatch ? 'matched' : 'pending',
                matchId: match._id,
                score
            });
        }

        res.status(400).json({ message: 'Invalid action' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to process action' });
    }
};



// @desc    Get all matches for current user
// @route   GET /api/matches
// @access  Private
const getMatches = async (req, res) => {
    try {
        const matches = await Match.find({
            users: req.user.id,
            status: 'matched'
        })
            .populate('users', 'name photos age topGenres topArtists') // Populate user details
            .sort({ createdAt: -1 }); // Default sort by new

        // Format response to return the OTHER user in the match
        const formattedMatches = matches.map(match => {
            const otherUser = match.users.find(u => u && u._id.toString() !== req.user.id);
            if (!otherUser) return null;
            return {
                _id: match._id,
                user: otherUser,
                score: match.score,
                breakdown: match.breakdown,
                createdAt: match.createdAt
            };
        }).filter(match => match !== null);

        res.json(formattedMatches);
    } catch (error) {
        console.error('Error fetching matches:', error);
        res.status(500).json({ message: 'Failed to fetch matches' });
    }
};

module.exports = {
    getDiscoveryMatches,
    handleMatchAction,
    getMatches
};
