const User = require('../models/User');

// Weights for different matching factors
const WEIGHTS = {
    ARTISTS: 0.30,
    GENRES: 0.25,
    AUDIO_FEATURES: 0.20,
    DIVERSITY: 0.15,
    DISCOVERY: 0.10
};

const calculateMatchScore = (userA, userB) => {
    let score = 0;
    const breakdown = {
        sharedArtists: [],
        sharedGenres: [],
        genreCompatibility: 0,
        audioFeaturesSimilarity: 0
    };

    // 1. Shared Artists (30%)
    const artistsA = new Set(userA.topArtists.map(a => a.id));
    const sharedArtists = userB.topArtists.filter(a => artistsA.has(a.id));
    breakdown.sharedArtists = sharedArtists.map(a => ({ name: a.name, id: a.id }));

    // Score based on percentage of shared artists (relative to smaller list)
    const minArtists = Math.min(userA.topArtists.length, userB.topArtists.length) || 1;
    const artistScore = (sharedArtists.length / minArtists) * 100;
    score += artistScore * WEIGHTS.ARTISTS;

    // 2. Genre Overlap (25%)
    const genresA = new Set(userA.topGenres);
    const sharedGenres = userB.topGenres.filter(g => genresA.has(g));
    breakdown.sharedGenres = sharedGenres;

    const minGenres = Math.min(userA.topGenres.length, userB.topGenres.length) || 1;
    const genreScore = (sharedGenres.length / minGenres) * 100;
    breakdown.genreCompatibility = genreScore;
    score += genreScore * WEIGHTS.GENRES;

    // 3. Audio Features Similarity (20%)
    // Calculate Euclidean distance between feature vectors
    const features = ['danceability', 'energy', 'valence', 'acousticness'];
    let distance = 0;

    features.forEach(feature => {
        const valA = userA.listeningStats?.[feature] || 0.5;
        const valB = userB.listeningStats?.[feature] || 0.5;
        distance += Math.pow(valA - valB, 2);
    });

    distance = Math.sqrt(distance);
    // Max possible distance is sqrt(4 * 1^2) = 2. Normalize to 0-1 similarity.
    const audioSimilarity = Math.max(0, (1 - (distance / 2)) * 100);
    breakdown.audioFeaturesSimilarity = audioSimilarity;
    score += audioSimilarity * WEIGHTS.AUDIO_FEATURES;

    // 4. Listening Diversity (15%)
    // Simple proxy: number of unique genres. Similar diversity levels match better?
    // Let's say we reward similar breadth of taste.
    const diversityA = userA.topGenres.length;
    const diversityB = userB.topGenres.length;
    const maxDiversity = Math.max(diversityA, diversityB) || 1;
    const diversityScore = (Math.min(diversityA, diversityB) / maxDiversity) * 100;
    score += diversityScore * WEIGHTS.DIVERSITY;

    // 5. Discovery Mindset (10%)
    // Placeholder: Random "serendipity" factor or based on 'openness' if we had it.
    // For now, let's give a baseline boost to encourage matching.
    const discoveryScore = 80;
    score += discoveryScore * WEIGHTS.DISCOVERY;

    return {
        score: Math.round(score),
        breakdown
    };
};

module.exports = {
    calculateMatchScore
};
