const express = require('express');
const router = express.Router();
const {
    getDiscoveryMatches,
    handleMatchAction
} = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getDiscoveryMatches); // Keeping discovery at root or specific path? 
// Wait, existing route was /discover for discovery.
// Let's add / for all matches.
router.get('/', protect, require('../controllers/matchController').getMatches);
router.get('/discover', protect, getDiscoveryMatches);
router.post('/action', protect, handleMatchAction);

module.exports = router;
