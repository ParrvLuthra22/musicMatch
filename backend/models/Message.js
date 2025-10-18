import { supabase } from '../config/supabase.js';

export const MessageModel = {
  // Get messages for a match
  async getByMatchId(matchId, limit = 100) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id(id, email)
      `)
      .eq('match_id', matchId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Create message
  async create(matchId, senderId, content) {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        match_id: matchId,
        sender_id: senderId,
        content,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get recent messages for a user across all matches
  async getRecentByUserId(userId, limit = 50) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        match:matches(
          *,
          user1:user1_id(id, email),
          user2:user2_id(id, email)
        )
      `)
      .or(`match.user1_id.eq.${userId},match.user2_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Delete message
  async delete(messageId) {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) throw error;
    return true;
  },

  // Get message count for a match
  async getCountByMatchId(matchId) {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('match_id', matchId);

    if (error) throw error;
    return count;
  },
};
