const eventService = require('../services/eventService');
const User = require('../models/User');
const Match = require('../models/Match');

// @desc    Get nearby events based on user preferences
// @route   GET /api/events/nearby
// @access  Private
const getNearbyEvents = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Use user's location if available, otherwise default to a major city or empty (global)
        // For now, let's assume we want events in "New York" as a default if no location is stored
        // Or we can get it from query params
        const location = req.query.location || user.location?.city || 'New York';

        // Get events for user's top artists
        // If user has no top artists synced, we might just search for "Music" in the location
        let events = [];
        if (user.topArtists && user.topArtists.length > 0) {
            events = await eventService.getEventsForArtists(user.topArtists, location);
        } else {
            // Fallback: generic music search
            events = await eventService.searchEvents('Music', location);
        }

        res.json(events);
    } catch (error) {
        console.error('Error fetching nearby events:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get events for a match (shared artists)
// @route   GET /api/events/for-match/:matchId
// @access  Private
const getMatchEvents = async (req, res) => {
    try {
        const { matchId } = req.params;
        const match = await Match.findById(matchId);

        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        // Check if user is part of the match
        if (!match.users.includes(req.user.id)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Get shared artists from match breakdown
        const sharedArtists = match.breakdown?.sharedArtists || [];

        if (sharedArtists.length === 0) {
            // If no shared artists, maybe fallback to each user's top artists combined?
            // For now, return empty or generic
            return res.json([]);
        }

        const location = req.query.location || 'New York'; // Default for now
        const events = await eventService.getEventsForArtists(sharedArtists, location);

        res.json(events);
    } catch (error) {
        console.error('Error fetching match events:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getNearbyEvents,
    getMatchEvents
};
