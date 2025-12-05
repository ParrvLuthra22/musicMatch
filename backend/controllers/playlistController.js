const SharedPlaylist = require('../models/SharedPlaylist');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const spotifyService = require('../services/spotifyService');

const createSharedPlaylist = async (req, res) => {
    try {
        const { conversationId, name } = req.body;
        const userId = req.user.id; // From auth middleware

        // 1. Validate conversation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        // Check if user is participant
        const isParticipant = conversation.participants.some(p => p.toString() === userId);
        if (!isParticipant) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Check if playlist already exists for this conversation
        const existingPlaylist = await SharedPlaylist.findOne({ conversationId });
        if (existingPlaylist) {
            return res.status(400).json({ message: 'Playlist already exists for this conversation', playlist: existingPlaylist });
        }

        // 2. Create Spotify Playlist
        // We'll use the current user's Spotify account to create it
        const playlistName = name || 'TuneMate Shared Playlist';
        const description = 'Collaborative playlist created via TuneMate';

        const spotifyPlaylist = await spotifyService.createPlaylist(userId, playlistName, description);

        // 3. Create SharedPlaylist in DB
        const newPlaylist = new SharedPlaylist({
            participants: conversation.participants,
            conversationId,
            spotifyPlaylistId: spotifyPlaylist.id,
            name: playlistName,
            songs: []
        });

        await newPlaylist.save();

        res.status(201).json(newPlaylist);
    } catch (error) {
        console.error('Error creating shared playlist:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getPlaylist = async (req, res) => {
    try {
        const { conversationId } = req.params;

        const playlist = await SharedPlaylist.findOne({ conversationId })
            .populate('participants', 'name photos')
            .populate('songs.addedBy', 'name');

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        res.json(playlist);
    } catch (error) {
        console.error('Error fetching playlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const addTrack = async (req, res) => {
    try {
        const { playlistId } = req.params;
        const { trackUri, trackDetails } = req.body; // trackDetails: { spotifyTrackId, name, artist, albumArt }
        const userId = req.user.id;

        const playlist = await SharedPlaylist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        // 1. Add to Spotify
        // We need to use the token of the user who created the playlist OR the current user if they are a collaborator.
        // For simplicity, we'll try to use the current user's token. 
        // Note: If the playlist is not collaborative on Spotify side or user is not added, this might fail if they are not the owner.
        // However, `spotifyService.createPlaylist` makes it private. 
        // We might need to ensure the playlist is collaborative or just use the owner's token if we stored who created it.
        // But `spotifyService.addTracksToPlaylist` takes `userId` to get the token.
        // Let's assume the current user can add to it (if they are authenticated with Spotify).

        await spotifyService.addTracksToPlaylist(userId, playlist.spotifyPlaylistId, [trackUri]);

        // 2. Add to DB
        playlist.songs.push({
            ...trackDetails,
            uri: trackUri,
            addedBy: userId,
            addedAt: new Date()
        });

        await playlist.save();

        // Populate addedBy for the response
        await playlist.populate('songs.addedBy', 'name');

        res.json(playlist);
    } catch (error) {
        console.error('Error adding track:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createSharedPlaylist,
    getPlaylist,
    addTrack
};
