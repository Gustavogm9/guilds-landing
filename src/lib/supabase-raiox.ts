import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_RAIOX_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_RAIOX_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase Raio-X environment variables. Check your .env file.');
}

// Client dedicado ao G-FORGE Raio-X (isolado do DB Institucional)
export const supabaseRaiox = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'guilds-raiox-auth-token', // Chave diferente para não conflitar com a sessão da landing
  },
});
