import { MatchModel } from '../models/Match.js';
import { ProfileModel } from '../models/Profile.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { calculateMatchScore, getSharedInterests, calculateCompatibility } from '../utils/matching.js';

/**
 * Get all matches for current user
 */
export const getMyMatches = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const matches = await MatchModel.getByUserId(req.userId, status);

  res.json({
    count: matches.length,
    matches,
  });
});

/**
 * Get accepted matches with full profile information
 */
export const getAcceptedMatches = asyncHandler(async (req, res) => {
  const matches = await MatchModel.getAcceptedMatchesWithProfiles(req.userId);

  // Format matches to include the other user's profile
  const formattedMatches = matches.map(match => {
    const otherProfile = match.user1_id === req.userId 
      ? match.user2_profile 
      : match.user1_profile;

    return {
      id: match.id,
      match_score: match.match_score,
      created_at: match.created_at,
      profile: otherProfile,
    };
  });

  res.json({
    count: formattedMatches.length,
    matches: formattedMatches,
  });
});

/**
 * Discover potential matches
 */
export const discoverMatches = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const minScore = parseInt(req.query.min_score) || 0;

  // Get current user's profile
  const myProfile = await ProfileModel.getByUserId(req.userId);

  if (!myProfile) {
    return res.status(404).json({ 
      error: 'Profile not found' 
    });
  }

  // Get all other profiles
  const allProfiles = await ProfileModel.getAll(req.userId, 100);

  // Get existing matches to exclude them
  const existingMatches = await MatchModel.getByUserId(req.userId);
  const existingMatchUserIds = new Set();
  existingMatches.forEach(match => {
    existingMatchUserIds.add(match.user1_id);
    existingMatchUserIds.add(match.user2_id);
  });

  // Calculate match scores and filter
  const potentialMatches = allProfiles
    .filter(profile => !existingMatchUserIds.has(profile.user_id))
    .map(profile => {
      const score = calculateMatchScore(myProfile, profile);
      const shared = getSharedInterests(myProfile, profile);
      const compatibility = calculateCompatibility(score);

      return {
        profile,
        match_score: score,
        shared_interests: shared,
        compatibility,
      };
    })
    .filter(match => match.match_score >= minScore)
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, limit);

  res.json({
    count: potentialMatches.length,
    matches: potentialMatches,
  });
});

/**
 * Create a match (send match request)
 */
export const createMatch = asyncHandler(async (req, res) => {
  const { user2_id } = req.body;

  // Check if user is trying to match with themselves
  if (user2_id === req.userId) {
    return res.status(400).json({ 
      error: 'Cannot match with yourself' 
    });
  }

  // Check if match already exists
  const existingMatch = await MatchModel.findBetweenUsers(req.userId, user2_id);
  if (existingMatch) {
    return res.status(400).json({ 
      error: 'Match already exists',
      match: existingMatch,
    });
  }

  // Get both profiles to calculate match score
  const [myProfile, theirProfile] = await Promise.all([
    ProfileModel.getByUserId(req.userId),
    ProfileModel.getByUserId(user2_id),
  ]);

  if (!theirProfile) {
    return res.status(404).json({ 
      error: 'User not found' 
    });
  }

  // Calculate match score
  const matchScore = calculateMatchScore(myProfile, theirProfile);

  // Create match
  const match = await MatchModel.create(req.userId, user2_id, matchScore);

  res.status(201).json({
    message: 'Match created successfully',
    match,
  });
});

/**
 * Update match status (accept/reject)
 */
export const updateMatchStatus = asyncHandler(async (req, res) => {
  const { matchId } = req.params;
  const { status } = req.body;

  // Get match
  const match = await MatchModel.getById(matchId);

  if (!match) {
    return res.status(404).json({ 
      error: 'Match not found' 
    });
  }

  // Verify user is part of the match
  if (match.user1_id !== req.userId && match.user2_id !== req.userId) {
    return res.status(403).json({ 
      error: 'Not authorized to update this match' 
    });
  }

  // Update status
  const updatedMatch = await MatchModel.updateStatus(matchId, status);

  res.json({
    message: `Match ${status} successfully`,
    match: updatedMatch,
  });
});

/**
 * Delete a match
 */
export const deleteMatch = asyncHandler(async (req, res) => {
  const { matchId } = req.params;

  // Get match
  const match = await MatchModel.getById(matchId);

  if (!match) {
    return res.status(404).json({ 
      error: 'Match not found' 
    });
  }

  // Verify user is part of the match
  if (match.user1_id !== req.userId && match.user2_id !== req.userId) {
    return res.status(403).json({ 
      error: 'Not authorized to delete this match' 
    });
  }

  // Delete match
  await MatchModel.delete(matchId);

  res.json({
    message: 'Match deleted successfully',
  });
});

/**
 * Get match by ID with full details
 */
export const getMatchById = asyncHandler(async (req, res) => {
  const { matchId } = req.params;

  const match = await MatchModel.getById(matchId);

  if (!match) {
    return res.status(404).json({ 
      error: 'Match not found' 
    });
  }

  // Verify user is part of the match
  if (match.user1_id !== req.userId && match.user2_id !== req.userId) {
    return res.status(403).json({ 
      error: 'Not authorized to view this match' 
    });
  }

  // Get both profiles
  const [profile1, profile2] = await Promise.all([
    ProfileModel.getByUserId(match.user1_id),
    ProfileModel.getByUserId(match.user2_id),
  ]);

  const sharedInterests = getSharedInterests(profile1, profile2);
  const compatibility = calculateCompatibility(match.match_score);

  res.json({
    ...match,
    user1_profile: profile1,
    user2_profile: profile2,
    shared_interests: sharedInterests,
    compatibility,
  });
});
