const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
    spotifyAuth,
    spotifyCallback
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/spotify', spotifyAuth);
router.get('/spotify/callback', spotifyCallback);

module.exports = router;
