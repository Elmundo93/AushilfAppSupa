import { getSupabaseClient } from '../../utils/supabaseclient';
import { User } from '../../types/auth';
import { SupabaseClient, Session } from '@supabase/supabase-js';
import { saveUserData, deleteUserData } from './AuthStoreHelpers';
import { SessionService } from './SessionService';

export class AuthService {
  private static instance: AuthService;
  private supabase: SupabaseClient | null = null;
  private sessionService: SessionService;

  private constructor() {
    this.sessionService = SessionService.getInstance();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async getSupabase(): Promise<SupabaseClient> {
    if (!this.supabase) {
      this.supabase = await getSupabaseClient();
    }
    return this.supabase;
  }

  async signUp(email: string, password: string, userData: Omit<User, 'id'>) {
    try {
      const supabase = await this.getSupabase();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        return { data: null, error };
      }
      if (data.user) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const { data: insertedUser, error: insertError } = await supabase
          .from('User')
          .insert({
            id: data.user.id,
            email: userData.email,
            vorname: userData.vorname,
            nachname: userData.nachname,
            location: userData.location,
            created_at: new Date().toISOString(),
          })
          .single();

        if (insertError) {
          console.error('Error inserting user data:', insertError);
          return { data: null, error: insertError };
        }

        if (data.session) {
          await this.sessionService.saveSession(data.session);
        }

        await saveUserData(insertedUser);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Sign-up error:', error);
      return { data: null, error };
    }
  }

  async signIn(email: string, password: string) {
    try {
      const supabase = await this.getSupabase();
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        return { data: null, error: authError };
      }

      if (authData.user) {
        const { data: userData, error: fetchError } = await supabase
          .from('User')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (fetchError) {
          console.error('Fehler beim Abrufen der Benutzerdaten:', fetchError);
          return { data: null, error: fetchError };
        }

        if (authData.session) {
          await this.sessionService.saveSession(authData.session);
        }

        await saveUserData(userData);

        return { data: userData, error: null };
      }

      return { data: null, error: new Error('Keine Benutzerdaten verfügbar') };
    } catch (error) {
      console.error('Anmeldefehler:', error);
      return { data: null, error };
    }
  }

  async signOut() {
    try {
      const supabase = await this.getSupabase();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      await this.sessionService.clearSession();
      await deleteUserData();

      return { error: null };
    } catch (error) {
      console.error('Abmeldefehler:', error);
      return { error };
    }
  }

  getSessionService(): SessionService {
    return this.sessionService;
  }
  async restoreSession(): Promise<boolean> {
    return await this.sessionService.restoreSession();
  }
  async refreshSession(): Promise<Session | null> {
    return await this.sessionService.refreshSession();
  }

  async getAccessToken(): Promise<string | null> {
    return await this.sessionService.getAccessToken();
  }



}