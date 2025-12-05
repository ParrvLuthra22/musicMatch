const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createSharedPlaylist, getPlaylist, addTrack } = require('../controllers/playlistController');

router.post('/create', protect, createSharedPlaylist);
router.get('/:conversationId', protect, getPlaylist);
router.post('/:playlistId/add-track', protect, addTrack);

module.exports = router;
