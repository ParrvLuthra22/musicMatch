const express = require('express');
const router = express.Router();
const {
    getDiscoveryMatches,
    handleMatchAction
} = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, require('../controllers/matchController').getMatches);
router.get('/discover', protect, getDiscoveryMatches);
router.post('/action', protect, handleMatchAction);

module.exports = router;
