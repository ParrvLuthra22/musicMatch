import { SpotifyAPI } from '../services/spotifyService.js';
import { ProfileModel } from '../models/Profile.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Get user's top tracks from Spotify
 */
export const getTopTracks = asyncHandler(async (req, res) => {
  const accessToken = req.session?.provider_token || req.headers['x-spotify-token'];
  
  if (!accessToken) {
    return res.status(401).json({ 
      error: 'Spotify access token required' 
    });
  }

  const timeRange = req.query.time_range || 'medium_term';
  const limit = parseInt(req.query.limit) || 20;

  const spotify = new SpotifyAPI(accessToken);
  const data = await spotify.getTopTracks(timeRange, limit);

  res.json(data);
});

/**
 * Get user's top artists from Spotify
 */
export const getTopArtists = asyncHandler(async (req, res) => {
  const accessToken = req.session?.provider_token || req.headers['x-spotify-token'];
  
  if (!accessToken) {
    return res.status(401).json({ 
      error: 'Spotify access token required' 
    });
  }

  const timeRange = req.query.time_range || 'medium_term';
  const limit = parseInt(req.query.limit) || 20;

  const spotify = new SpotifyAPI(accessToken);
  const data = await spotify.getTopArtists(timeRange, limit);

  res.json(data);
});

/**
 * Get currently playing track
 */
export const getCurrentlyPlaying = asyncHandler(async (req, res) => {
  const accessToken = req.session?.provider_token || req.headers['x-spotify-token'];
  
  if (!accessToken) {
    return res.status(401).json({ 
      error: 'Spotify access token required' 
    });
  }

  const spotify = new SpotifyAPI(accessToken);
  const data = await spotify.getCurrentlyPlaying();

  res.json(data || { isPlaying: false });
});

/**
 * Get user's Spotify profile
 */
export const getSpotifyProfile = asyncHandler(async (req, res) => {
  const accessToken = req.session?.provider_token || req.headers['x-spotify-token'];
  
  if (!accessToken) {
    return res.status(401).json({ 
      error: 'Spotify access token required' 
    });
  }

  const spotify = new SpotifyAPI(accessToken);
  const data = await spotify.getUserProfile();

  res.json(data);
});

/**
 * Sync Spotify data to user profile
 */
export const syncSpotifyData = asyncHandler(async (req, res) => {
  const accessToken = req.session?.provider_token || req.headers['x-spotify-token'];
  
  if (!accessToken) {
    return res.status(401).json({ 
      error: 'Spotify access token required' 
    });
  }

  const spotify = new SpotifyAPI(accessToken);

  // Fetch top artists and tracks
  const [topArtists, topTracks, profile] = await Promise.all([
    spotify.getTopArtists('medium_term', 20),
    spotify.getTopTracks('medium_term', 20),
    spotify.getUserProfile(),
  ]);

  // Extract genres from top artists
  const genresSet = new Set();
  topArtists.items.forEach(artist => {
    artist.genres.forEach(genre => genresSet.add(genre));
  });

  // Prepare update data
  const updates = {
    spotify_id: profile.id,
    top_artists: topArtists.items.map(artist => artist.name),
    top_genres: Array.from(genresSet).slice(0, 20), // Limit to 20 genres
  };

  // Update profile
  const updatedProfile = await ProfileModel.update(req.userId, updates);

  res.json({
    message: 'Spotify data synced successfully',
    profile: updatedProfile,
    stats: {
      artists: topArtists.items.length,
      genres: updates.top_genres.length,
      tracks: topTracks.items.length,
    },
  });
});

/**
 * Search Spotify
 */
export const search = asyncHandler(async (req, res) => {
  const accessToken = req.session?.provider_token || req.headers['x-spotify-token'];
  
  if (!accessToken) {
    return res.status(401).json({ 
      error: 'Spotify access token required' 
    });
  }

  const { q, type, limit } = req.query;

  if (!q) {
    return res.status(400).json({ 
      error: 'Search query is required' 
    });
  }

  const types = type ? type.split(',') : ['track', 'artist'];
  const searchLimit = parseInt(limit) || 20;

  const spotify = new SpotifyAPI(accessToken);
  const data = await spotify.search(q, types, searchLimit);

  res.json(data);
});
