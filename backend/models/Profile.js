import { supabase, supabaseAdmin } from '../config/supabase.js';

export const ProfileModel = {
  // Get profile by user ID
  async getByUserId(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  // Get profile by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Get all profiles (for discovery)
  async getAll(excludeUserId = null, limit = 50) {
    let query = supabase
      .from('profiles')
      .select('*')
      .limit(limit);

    if (excludeUserId) {
      query = query.neq('user_id', excludeUserId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Create profile
  async create(profileData) {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update profile
  async update(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete profile
  async delete(userId) {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  },

  // Search profiles by name
  async searchByName(searchTerm, limit = 20) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('full_name', `%${searchTerm}%`)
      .limit(limit);

    if (error) throw error;
    return data;
  },
};
