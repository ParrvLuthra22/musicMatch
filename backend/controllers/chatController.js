const Conversation = require('../models/Conversation');
const Match = require('../models/Match');
const User = require('../models/User');

// @desc    Get all conversations for current user
// @route   GET /api/conversations
// @access  Private
const getConversations = async (req, res) => {
    try {
        // Find all conversations where user is a participant
        const conversations = await Conversation.find({
            participants: req.user._id
        })
            .populate('participants', 'name photos')
            .sort({ updatedAt: -1 });

        // Also check for Matches that don't have a conversation yet but should (optional, or handle on frontend)
        // For now, let's just return existing conversations.
        // Ideally, when a match happens, we create a conversation or we list matches as "New Matches"

        res.json(conversations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get messages for a conversation
// @route   GET /api/conversations/:id/messages
// @access  Private
const getMessages = async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id)
            .populate('messages.sender', 'name photos');

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        // Verify participant
        if (!conversation.participants.includes(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(conversation.messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Send a message
// @route   POST /api/conversations/:id/message
// @access  Private
const sendMessage = async (req, res) => {
    const { content, type = 'text', spotifyTrack } = req.body;
    const conversationId = req.params.id;

    try {
        let conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            // Check if it's a new conversation from a match? 
            // For simplicity, assume conversation exists or is created via a separate endpoint 'startConversation'
            // Or if ID is actually a USER ID, we find/create conversation.
            // Let's stick to: ID is Conversation ID.
            return res.status(404).json({ message: 'Conversation not found' });
        }

        const newMessage = {
            sender: req.user._id,
            content,
            type, // 'text' or 'song'
            spotifyTrack, // Optional: { id, name, artist, image, previewUrl }
            timestamp: new Date()
        };

        conversation.messages.push(newMessage);
        conversation.lastMessage = {
            content: type === 'song' ? `Sent a song: ${spotifyTrack.name}` : content,
            sender: req.user._id,
            timestamp: new Date(),
            read: false
        };

        await conversation.save();

        // Emit socket event
        const io = req.app.get('io');
        io.to(conversationId).emit('receive_message', {
            ...newMessage,
            _id: conversation.messages[conversation.messages.length - 1]._id,
            conversationId
        });

        res.json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Start a conversation with a user (if match exists)
// @route   POST /api/conversations/start
// @access  Private
const startConversation = async (req, res) => {
    const { targetUserId } = req.body;

    try {
        // Check if match exists
        const match = await Match.findOne({
            users: { $all: [req.user._id, targetUserId] },
            status: 'matched'
        });

        if (!match) {
            return res.status(400).json({ message: 'No match found with this user' });
        }

        // Check if conversation already exists
        let conversation = await Conversation.findOne({
            participants: { $all: [req.user._id, targetUserId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [req.user._id, targetUserId],
                messages: []
            });
        }

        res.json(conversation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getConversations,
    getMessages,
    sendMessage,
    startConversation
};
