import { ProfileModel } from '../models/Profile.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Get current user's profile
 */
export const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await ProfileModel.getByUserId(req.userId);
  
  if (!profile) {
    return res.status(404).json({ 
      error: 'Profile not found' 
    });
  }
  
  res.json(profile);
});

/**
 * Get profile by ID
 */
export const getProfileById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const profile = await ProfileModel.getById(id);
  
  if (!profile) {
    return res.status(404).json({ 
      error: 'Profile not found' 
    });
  }
  
  res.json(profile);
});

/**
 * Get profile by user ID
 */
export const getProfileByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const profile = await ProfileModel.getByUserId(userId);
  
  if (!profile) {
    return res.status(404).json({ 
      error: 'Profile not found' 
    });
  }
  
  res.json(profile);
});

/**
 * Update current user's profile
 */
export const updateMyProfile = asyncHandler(async (req, res) => {
  const allowedUpdates = [
    'full_name',
    'bio',
    'avatar_url',
    'spotify_id',
    'top_genres',
    'top_artists',
  ];
  
  const updates = {};
  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });
  
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ 
      error: 'No valid fields to update' 
    });
  }
  
  const profile = await ProfileModel.update(req.userId, updates);
  
  res.json({
    message: 'Profile updated successfully',
    profile,
  });
});

/**
 * Get all profiles (for discovery)
 */
export const getAllProfiles = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const profiles = await ProfileModel.getAll(req.userId, limit);
  
  res.json({
    count: profiles.length,
    profiles,
  });
});

/**
 * Search profiles by name
 */
export const searchProfiles = asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q || q.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Search query is required' 
    });
  }
  
  const limit = parseInt(req.query.limit) || 20;
  const profiles = await ProfileModel.searchByName(q, limit);
  
  res.json({
    count: profiles.length,
    profiles,
  });
});

/**
 * Delete current user's profile
 */
export const deleteMyProfile = asyncHandler(async (req, res) => {
  await ProfileModel.delete(req.userId);
  
  res.json({
    message: 'Profile deleted successfully',
  });
});
