const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Basic Auth
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    passwordHash: {
        type: String,
        required: function () { return !this.spotifyId; } // Password required if not logging in via Spotify initially (though app is Spotify-based, flexibility is good)
    },

    // Profile
    name: {
        type: String,
        required: true,
        trim: true
    },
    bio: {
        type: String,
        maxLength: 500
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'non-binary', 'other']
    },
    photos: [{
        type: String // URLs to photos
    }],
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        }
    },

    // Spotify Data
    spotifyId: {
        type: String,
        unique: true,
        sparse: true
    },
    accessToken: String,
    refreshToken: String,
    topArtists: [{
        name: String,
        id: String,
        genres: [String],
        image: String
    }],
    topTracks: [{
        name: String,
        id: String,
        artist: String,
        image: String,
        previewUrl: String
    }],
    topGenres: [String],
    listeningStats: {
        danceability: Number,
        energy: Number,
        valence: Number,
        acousticness: Number
    },

    // Preferences
    preferences: {
        ageRange: {
            min: { type: Number, default: 18 },
            max: { type: Number, default: 100 }
        },
        distance: {
            type: Number, // in kilometers
            default: 50
        },
        genderPreference: [{
            type: String,
            enum: ['male', 'female', 'non-binary', 'other']
        }]
    }
}, {
    timestamps: true
});

// Index for geospatial queries
userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
