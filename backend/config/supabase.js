import { createClient } from '@supabase/supabase-js';
import { config } from '../config/config.js';

// Admin client with service role key (for server-side operations)
export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Client with anon key (for user operations)
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
);

export default supabase;
