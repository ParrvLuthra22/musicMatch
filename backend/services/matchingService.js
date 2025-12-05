const User = require('../models/User');

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

    const artistsA = new Set(userA.topArtists.map(a => a.id));
    const sharedArtists = userB.topArtists.filter(a => artistsA.has(a.id));
    breakdown.sharedArtists = sharedArtists.map(a => ({ name: a.name, id: a.id }));

    const minArtists = Math.min(userA.topArtists.length, userB.topArtists.length) || 1;
    const artistScore = (sharedArtists.length / minArtists) * 100;
    score += artistScore * WEIGHTS.ARTISTS;

    const genresA = new Set(userA.topGenres);
    const sharedGenres = userB.topGenres.filter(g => genresA.has(g));
    breakdown.sharedGenres = sharedGenres;

    const minGenres = Math.min(userA.topGenres.length, userB.topGenres.length) || 1;
    const genreScore = (sharedGenres.length / minGenres) * 100;
    breakdown.genreCompatibility = genreScore;
    score += genreScore * WEIGHTS.GENRES;

    const features = ['danceability', 'energy', 'valence', 'acousticness'];
    let distance = 0;

    features.forEach(feature => {
        const valA = userA.listeningStats?.[feature] || 0.5;
        const valB = userB.listeningStats?.[feature] || 0.5;
        distance += Math.pow(valA - valB, 2);
    });

    distance = Math.sqrt(distance);
    const audioSimilarity = Math.max(0, (1 - (distance / 2)) * 100);
    breakdown.audioFeaturesSimilarity = audioSimilarity;
    score += audioSimilarity * WEIGHTS.AUDIO_FEATURES;

    const diversityA = userA.topGenres.length;
    const diversityB = userB.topGenres.length;
    const maxDiversity = Math.max(diversityA, diversityB) || 1;
    const diversityScore = (Math.min(diversityA, diversityB) / maxDiversity) * 100;
    score += diversityScore * WEIGHTS.DIVERSITY;

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
