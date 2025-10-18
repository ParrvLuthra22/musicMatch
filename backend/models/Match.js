import { supabase } from '../config/supabase.js';

export const MatchModel = {
  // Get all matches for a user
  async getByUserId(userId, status = null) {
    let query = supabase
      .from('matches')
      .select(`
        *,
        user1:user1_id(id, email),
        user2:user2_id(id, email)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Get specific match
  async getById(matchId) {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single();

    if (error) throw error;
    return data;
  },

  // Check if match exists between two users
  async findBetweenUsers(user1Id, user2Id) {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .or(
        `and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`
      )
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Create match
  async create(user1Id, user2Id, matchScore) {
    const { data, error } = await supabase
      .from('matches')
      .insert({
        user1_id: user1Id,
        user2_id: user2Id,
        match_score: matchScore,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update match status
  async updateStatus(matchId, status) {
    const { data, error } = await supabase
      .from('matches')
      .update({ 
        status,
        updated_at: new Date().toISOString() 
      })
      .eq('id', matchId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update match score
  async updateScore(matchId, score) {
    const { data, error } = await supabase
      .from('matches')
      .update({ 
        match_score: score,
        updated_at: new Date().toISOString() 
      })
      .eq('id', matchId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete match
  async delete(matchId) {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', matchId);

    if (error) throw error;
    return true;
  },

  // Get accepted matches with profile info
  async getAcceptedMatchesWithProfiles(userId) {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        user1_profile:profiles!matches_user1_id_fkey(*),
        user2_profile:profiles!matches_user2_id_fkey(*)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .eq('status', 'accepted')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};
