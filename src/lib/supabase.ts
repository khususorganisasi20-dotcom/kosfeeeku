import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from environment or user-configured localStorage
const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  
  const customUrl = localStorage.getItem('kosfeeku_supabase_url');
  const customKey = localStorage.getItem('kosfeeku_supabase_anon_key');

  const supabaseUrl = customUrl || envUrl || '';
  const supabaseKey = customKey || envKey || '';

  const isConfigured = Boolean(
    supabaseUrl && 
    supabaseUrl.startsWith('https://') && 
    supabaseKey && 
    supabaseKey.length > 20
  );

  return { supabaseUrl, supabaseKey, isConfigured };
};

export const { supabaseUrl, supabaseKey, isConfigured: isSupabaseConfigured } = getSupabaseConfig();

let client: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (err) {
    console.warn('Supabase client initialization notice:', err);
  }
}

export const supabase = client;

export const updateSupabaseCredentials = (url: string, key: string) => {
  if (url) localStorage.setItem('kosfeeku_supabase_url', url.trim());
  if (key) localStorage.setItem('kosfeeku_supabase_anon_key', key.trim());
  window.location.reload();
};

export const clearSupabaseCredentials = () => {
  localStorage.removeItem('kosfeeku_supabase_url');
  localStorage.removeItem('kosfeeku_supabase_anon_key');
  window.location.reload();
};
