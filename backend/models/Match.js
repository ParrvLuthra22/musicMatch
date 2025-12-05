const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    breakdown: {
        sharedArtists: [{
            name: String,
            id: String
        }],
        sharedGenres: [String],
        genreCompatibility: Number, // Score for genre overlap
        audioFeaturesSimilarity: Number // Score for audio features similarity
    },
    status: {
        type: String,
        enum: ['pending', 'matched', 'passed'],
        default: 'pending'
    },
    lastInteraction: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient querying of a user's matches
matchSchema.index({ users: 1, status: 1 });

module.exports = mongoose.model('Match', matchSchema);
