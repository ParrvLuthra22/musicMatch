const mongoose = require('mongoose');

const sharedPlaylistSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    spotifyPlaylistId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        default: 'TuneMate Shared Playlist'
    },
    songs: [{
        spotifyTrackId: String,
        uri: String,
        name: String,
        artist: String,
        albumArt: String,
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    matchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SharedPlaylist', sharedPlaylistSchema);
