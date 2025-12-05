const express = require('express');
const router = express.Router();
const {
    getProfile,
    updateProfile,
    uploadPhoto,
    deletePhoto
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, getProfile);
router.put('/update', protect, updateProfile);
router.post('/upload-photo', protect, uploadPhoto);
router.delete('/photo/:filename', protect, deletePhoto);

module.exports = router;
