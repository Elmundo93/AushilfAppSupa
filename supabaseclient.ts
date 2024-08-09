import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getAuthToken } from './src/components/Cruid/AuthHelpers';
import { SUPABASE_URL, SUPABASE_KEY } from '@env';

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_KEY;

let supabase: SupabaseClient | null = null;

export async function getSupabaseClient(): Promise<SupabaseClient> {
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  
  const token = await getAuthToken();

  if (token && supabase) {
    await supabase.auth.setSession({ access_token: token, refresh_token: token });
  }

  return supabase;
}