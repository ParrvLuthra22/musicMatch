import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { matchValidation } from '../middleware/validation.js';
import * as matchController from '../controllers/matchController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all matches for current user
router.get('/', matchController.getMyMatches);

// Get accepted matches with profiles
router.get('/accepted', matchController.getAcceptedMatches);

// Discover potential matches
router.get('/discover', matchController.discoverMatches);

// Create a match
router.post('/', matchValidation.create, matchController.createMatch);

// Get match by ID
router.get('/:matchId', matchController.getMatchById);

// Update match status
router.patch('/:matchId/status', matchValidation.updateStatus, matchController.updateMatchStatus);

// Delete match
router.delete('/:matchId', matchController.deleteMatch);

export default router;
