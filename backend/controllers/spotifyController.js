const spotifyService = require('../services/spotifyService');
const SharedPlaylist = require('../models/SharedPlaylist');

// @desc    Sync user's Spotify data
// @route   GET /api/spotify/sync
// @access  Private
const syncData = async (req, res) => {
    try {
        const updatedUser = await spotifyService.syncSpotifyData(req.user._id);
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to sync Spotify data' });
    }
};

// @desc    Get Spotify Profile
// @route   GET /api/spotify/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const response = await spotifyService.makeSpotifyRequest(req.user, 'get', 'https://api.spotify.com/v1/me');
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get Spotify profile' });
    }
};

// @desc    Create Shared Playlist
// @route   POST /api/spotify/playlist/create
// @access  Private
const createSharedPlaylist = async (req, res) => {
    const { name, description, participants } = req.body;

    try {
        const spotifyPlaylist = await spotifyService.createPlaylist(req.user._id, name, description);

        const sharedPlaylist = await SharedPlaylist.create({
            participants: [req.user._id, ...participants],
            spotifyPlaylistId: spotifyPlaylist.id,
            name: spotifyPlaylist.name
        });

        res.status(201).json(sharedPlaylist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create shared playlist' });
    }
};

// @desc    Add Track to Playlist
// @route   POST /api/spotify/playlist/add-track
// @access  Private
const addTrack = async (req, res) => {
    const { playlistId, trackUri, trackName, trackArtist, trackId } = req.body;

    try {
        const sharedPlaylist = await SharedPlaylist.findOne({ spotifyPlaylistId: playlistId });
        if (!sharedPlaylist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        await spotifyService.addTracksToPlaylist(req.user._id, playlistId, [trackUri]);

        sharedPlaylist.songs.push({
            spotifyTrackId: trackId,
            name: trackName,
            artist: trackArtist,
            addedBy: req.user._id
        });
        await sharedPlaylist.save();

        res.json(sharedPlaylist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add track' });
    }
};

// @desc    Search for tracks
// @route   GET /api/spotify/search
// @access  Private
const searchTracks = async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ message: 'Query is required' });
    }

    try {
        const response = await spotifyService.makeSpotifyRequest(req.user, 'get', `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`);

        const tracks = response.data.tracks.items.map(track => ({
            spotifyTrackId: track.id,
            name: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            albumArt: track.album.images[0]?.url,
            uri: track.uri
        }));

        res.json(tracks);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Failed to search tracks' });
    }
};

module.exports = {
    syncData,
    getProfile,
    createSharedPlaylist,
    addTrack,
    searchTracks
};
