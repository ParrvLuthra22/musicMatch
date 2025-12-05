const axios = require('axios');
const User = require('../models/User');

// Helper to refresh access token
const refreshAccessToken = async (user) => {
    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'refresh_token');
        params.append('refresh_token', user.refreshToken);

        const response = await axios.post('https://accounts.spotify.com/api/token', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
            }
        });

        const { access_token, refresh_token } = response.data;

        user.accessToken = access_token;
        if (refresh_token) {
            user.refreshToken = refresh_token;
        }
        await user.save();

        return access_token;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw new Error('Failed to refresh access token');
    }
};

// Wrapper for Spotify API requests to handle token expiration
const makeSpotifyRequest = async (user, method, url, data = null) => {
    try {
        const config = {
            method,
            url,
            headers: { Authorization: `Bearer ${user.accessToken}` },
            data
        };
        return await axios(config);
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Token expired, refresh and retry
            const newAccessToken = await refreshAccessToken(user);
            const config = {
                method,
                url,
                headers: { Authorization: `Bearer ${newAccessToken}` },
                data
            };
            return await axios(config);
        }
        throw error;
    }
};

const syncSpotifyData = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    try {
        // 1. Get Top Artists
        const topArtistsRes = await makeSpotifyRequest(user, 'get', 'https://api.spotify.com/v1/me/top/artists?limit=20&time_range=medium_term');
        const topArtists = topArtistsRes.data.items.map(artist => ({
            name: artist.name,
            id: artist.id,
            genres: artist.genres,
            image: artist.images[0]?.url
        }));

        // 2. Get Top Tracks
        const topTracksRes = await makeSpotifyRequest(user, 'get', 'https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=medium_term');
        const topTracks = topTracksRes.data.items.map(track => ({
            name: track.name,
            id: track.id,
            artist: track.artists[0].name,
            image: track.album.images[0]?.url,
            previewUrl: track.preview_url
        }));

        // 3. Calculate Top Genres from Artists
        const allGenres = topArtists.flatMap(artist => artist.genres);
        const genreCounts = allGenres.reduce((acc, genre) => {
            acc[genre] = (acc[genre] || 0) + 1;
            return acc;
        }, {});
        const topGenres = Object.entries(genreCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([genre]) => genre);

        // 4. Get Audio Features for Top Tracks
        const trackIds = topTracks.map(t => t.id).join(',');
        const featuresRes = await makeSpotifyRequest(user, 'get', `https://api.spotify.com/v1/audio-features?ids=${trackIds}`);
        const features = featuresRes.data.audio_features.filter(f => f !== null);

        // Calculate average audio features
        const avgFeatures = features.reduce((acc, curr) => {
            acc.danceability += curr.danceability;
            acc.energy += curr.energy;
            acc.valence += curr.valence;
            acc.acousticness += curr.acousticness;
            return acc;
        }, { danceability: 0, energy: 0, valence: 0, acousticness: 0 });

        const count = features.length || 1;
        const listeningStats = {
            danceability: avgFeatures.danceability / count,
            energy: avgFeatures.energy / count,
            valence: avgFeatures.valence / count,
            acousticness: avgFeatures.acousticness / count
        };

        // Update User
        user.topArtists = topArtists;
        user.topTracks = topTracks;
        user.topGenres = topGenres;
        user.listeningStats = listeningStats;
        await user.save();

        return user;
    } catch (error) {
        console.error('Error syncing Spotify data:', error);
        throw error;
    }
};

const createPlaylist = async (userId, name, description) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const response = await makeSpotifyRequest(user, 'post', `https://api.spotify.com/v1/users/${user.spotifyId}/playlists`, {
        name,
        description,
        public: false
    });

    return response.data;
};

const addTracksToPlaylist = async (userId, playlistId, uris) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    await makeSpotifyRequest(user, 'post', `https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        uris
    });
};

module.exports = {
    syncSpotifyData,
    createPlaylist,
    addTracksToPlaylist,
    makeSpotifyRequest
};
