import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as spotifyController from '../controllers/spotifyController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get user's top tracks
router.get('/top-tracks', spotifyController.getTopTracks);

// Get user's top artists
router.get('/top-artists', spotifyController.getTopArtists);

// Get currently playing track
router.get('/currently-playing', spotifyController.getCurrentlyPlaying);

// Get Spotify profile
router.get('/profile', spotifyController.getSpotifyProfile);

// Sync Spotify data to profile
router.post('/sync', spotifyController.syncSpotifyData);

// Search Spotify
router.get('/search', spotifyController.search);

export default router;
