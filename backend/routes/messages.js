import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { messageValidation } from '../middleware/validation.js';
import * as messageController from '../controllers/messageController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get conversations (matches with latest message)
router.get('/conversations', messageController.getConversations);

// Get recent messages across all matches
router.get('/recent', messageController.getMyRecentMessages);

// Get messages for a specific match
router.get('/match/:matchId', messageController.getMessagesByMatchId);

// Send a message
router.post('/', messageValidation.create, messageController.sendMessage);

// Delete a message
router.delete('/:messageId', messageController.deleteMessage);

export default router;
