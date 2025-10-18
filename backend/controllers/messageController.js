import { MessageModel } from '../models/Message.js';
import { MatchModel } from '../models/Match.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Get messages for a match
 */
export const getMessagesByMatchId = asyncHandler(async (req, res) => {
  const { matchId } = req.params;
  const limit = parseInt(req.query.limit) || 100;

  // Verify user is part of the match
  const match = await MatchModel.getById(matchId);
  
  if (!match) {
    return res.status(404).json({ 
      error: 'Match not found' 
    });
  }

  if (match.user1_id !== req.userId && match.user2_id !== req.userId) {
    return res.status(403).json({ 
      error: 'Not authorized to view messages for this match' 
    });
  }

  if (match.status !== 'accepted') {
    return res.status(403).json({ 
      error: 'Can only view messages for accepted matches' 
    });
  }

  const messages = await MessageModel.getByMatchId(matchId, limit);

  res.json({
    count: messages.length,
    messages,
  });
});

/**
 * Send a message
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const { match_id, content } = req.body;

  // Verify match exists and user is part of it
  const match = await MatchModel.getById(match_id);
  
  if (!match) {
    return res.status(404).json({ 
      error: 'Match not found' 
    });
  }

  if (match.user1_id !== req.userId && match.user2_id !== req.userId) {
    return res.status(403).json({ 
      error: 'Not authorized to send messages to this match' 
    });
  }

  if (match.status !== 'accepted') {
    return res.status(403).json({ 
      error: 'Can only send messages to accepted matches' 
    });
  }

  // Create message
  const message = await MessageModel.create(match_id, req.userId, content);

  res.status(201).json({
    message: 'Message sent successfully',
    data: message,
  });
});

/**
 * Get all recent messages for current user
 */
export const getMyRecentMessages = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const messages = await MessageModel.getRecentByUserId(req.userId, limit);

  res.json({
    count: messages.length,
    messages,
  });
});

/**
 * Delete a message
 */
export const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  // Get message to verify ownership
  const messages = await MessageModel.getRecentByUserId(req.userId, 1000);
  const message = messages.find(m => m.id === messageId);

  if (!message) {
    return res.status(404).json({ 
      error: 'Message not found' 
    });
  }

  if (message.sender_id !== req.userId) {
    return res.status(403).json({ 
      error: 'Not authorized to delete this message' 
    });
  }

  await MessageModel.delete(messageId);

  res.json({
    message: 'Message deleted successfully',
  });
});

/**
 * Get conversations (matches with latest message)
 */
export const getConversations = asyncHandler(async (req, res) => {
  // Get accepted matches
  const matches = await MatchModel.getAcceptedMatchesWithProfiles(req.userId);

  // Get latest message for each match
  const conversations = await Promise.all(
    matches.map(async (match) => {
      const messages = await MessageModel.getByMatchId(match.id, 1);
      const messageCount = await MessageModel.getCountByMatchId(match.id);
      
      const otherProfile = match.user1_id === req.userId 
        ? match.user2_profile 
        : match.user1_profile;

      return {
        match_id: match.id,
        match_score: match.match_score,
        profile: otherProfile,
        latest_message: messages[0] || null,
        message_count: messageCount,
        created_at: match.created_at,
      };
    })
  );

  // Sort by latest message time
  conversations.sort((a, b) => {
    const timeA = a.latest_message?.created_at || a.created_at;
    const timeB = b.latest_message?.created_at || b.created_at;
    return new Date(timeB) - new Date(timeA);
  });

  res.json({
    count: conversations.length,
    conversations,
  });
});
