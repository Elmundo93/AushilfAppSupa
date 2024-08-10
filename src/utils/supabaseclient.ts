import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '@env';
import { SessionService } from '../services/auth/SessionService';

let supabaseInstance: SupabaseClient | null = null;

export const initializeSupabase = async (): Promise<void> => {
  if (supabaseInstance) return;

  const sessionService = SessionService.getInstance();

  supabaseInstance = createClient(
    SUPABASE_URL,
    SUPABASE_KEY,
    {
      auth: {
        storage: {
          getItem: async (key: string) => {
            const session = await sessionService.getSession();
            return session ? JSON.stringify(session) : null;
          },
          setItem: async (key: string, value: string) => {
            const session = JSON.parse(value);
            await sessionService.saveSession(session);
          },
          removeItem: async (key: string) => {
            await sessionService.clearSession();
          },
        },
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    }
  );
};

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseInstance) {
    throw new Error('Supabase wurde nicht initialisiert. Bitte rufen Sie initializeSupabase() zuerst auf.');
  }
  return supabaseInstance;
};