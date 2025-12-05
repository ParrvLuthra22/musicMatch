const express = require('express');
const router = express.Router();
const {
    getConversations,
    getMessages,
    sendMessage,
    startConversation
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getConversations);
router.get('/:id/messages', protect, getMessages);
router.post('/:id/message', protect, sendMessage);
router.post('/start', protect, startConversation);

module.exports = router;
