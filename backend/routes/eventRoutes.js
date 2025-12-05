const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getNearbyEvents, getMatchEvents } = require('../controllers/eventController');

router.get('/nearby', protect, getNearbyEvents);
router.get('/for-match/:matchId', protect, getMatchEvents);

module.exports = router;
