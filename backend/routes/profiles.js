import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { profileValidation } from '../middleware/validation.js';
import * as profileController from '../controllers/profileController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get current user's profile
router.get('/me', profileController.getMyProfile);

// Update current user's profile
router.put('/me', profileValidation.update, profileController.updateMyProfile);

// Delete current user's profile
router.delete('/me', profileController.deleteMyProfile);

// Get all profiles (for discovery)
router.get('/', profileController.getAllProfiles);

// Search profiles
router.get('/search', profileController.searchProfiles);

// Get profile by ID
router.get('/:id', profileController.getProfileById);

// Get profile by user ID
router.get('/user/:userId', profileController.getProfileByUserId);

export default router;
