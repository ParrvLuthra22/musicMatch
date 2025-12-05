const User = require('../models/User');
const Match = require('../models/Match');
const matchingService = require('../services/matchingService');

// @desc    Get potential matches
// @route   GET /api/matches/discover
// @access  Private
const getDiscoveryMatches = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);

        // Get IDs of users already interacted with
        const existingMatches = await Match.find({
            users: currentUser._id
        }).select('users');

        const interactedUserIds = existingMatches.flatMap(m => m.users.map(u => u.toString()));
        interactedUserIds.push(currentUser._id.toString()); // Exclude self

        // Find potential matches (basic filtering)
        // In a real app, we'd use geospatial queries here
        const potentialMatches = await User.find({
            _id: { $nin: interactedUserIds },
            // Add gender/age filtering here based on currentUser.preferences
        }).limit(10);

        // Calculate scores for these candidates
        const scoredMatches = potentialMatches.map(user => {
            const { score, breakdown } = matchingService.calculateMatchScore(currentUser, user);
            return {
                user,
                score,
                breakdown
            };
        });

        // Sort by score descending
        scoredMatches.sort((a, b) => b.score - a.score);

        res.json(scoredMatches);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get matches' });
    }
};

// @desc    Handle match action (like/pass)
// @route   POST /api/matches/action
// @access  Private
const handleMatchAction = async (req, res) => {
    const { targetUserId, action } = req.body; // action: 'like' or 'pass'
    const currentUserId = req.user._id;

    try {
        if (action === 'pass') {
            // Create a "passed" match record so they don't show up again
            await Match.create({
                users: [currentUserId, targetUserId],
                score: 0, // Irrelevant for pass
                status: 'passed'
            });
            return res.json({ status: 'passed' });
        }

        if (action === 'like') {
            // Check if target user already liked current user
            const existingMatch = await Match.findOne({
                users: { $all: [currentUserId, targetUserId] },
                status: 'pending' // Assuming 'pending' means one side liked (needs better state mgmt in real app)
                // Actually, simpler logic: check if there's a match record where targetUser liked currentUser
                // For this MVP, let's assume we just create a match record. 
                // Real Tinder logic: 
                // 1. Check if reverse 'like' exists. 
                // 2. If yes, update to 'matched'. 
                // 3. If no, create 'pending' (or 'liked_by_initiator').
            });

            // Simplified "Mutual Like" check for MVP:
            // We need to store who liked whom. 
            // Let's check if there is a 'pending' match initiated by targetUser?
            // For now, let's just create a match with status 'matched' if score > 70 (Auto-match for demo?)
            // OR better: Check if a "half-match" exists.

            // Let's stick to the schema: Match has 'users' array.
            // We need to know WHO liked. 
            // Let's assume for this MVP: 
            // If a match exists with status 'pending' AND created by targetUser -> It's a match!
            // But we didn't add 'initiator' to schema. 

            // Let's just calculate score and save it.
            const currentUser = await User.findById(currentUserId);
            const targetUser = await User.findById(targetUserId);
            const { score, breakdown } = matchingService.calculateMatchScore(currentUser, targetUser);

            // Check if reverse interaction exists (simulated)
            // For demo purposes, let's say if score > 75, it's an instant match!
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
            const otherUser = match.users.find(u => u._id.toString() !== req.user.id);
            return {
                _id: match._id,
                user: otherUser,
                score: match.score,
                breakdown: match.breakdown,
                createdAt: match.createdAt
            };
        });

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
