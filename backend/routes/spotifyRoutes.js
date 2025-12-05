const express = require('express');
const router = express.Router();
const {
    syncData,
    getProfile,
    createSharedPlaylist,
    addTrack,
    searchTracks
} = require('../controllers/spotifyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/sync', protect, syncData);
router.get('/profile', protect, getProfile);
router.get('/search', protect, searchTracks);
router.post('/playlist/create', protect, createSharedPlaylist);
router.post('/playlist/add-track', protect, addTrack);

module.exports = router;
