import * as SecureStore from 'expo-secure-store';
import { Session } from '@supabase/supabase-js';
import { getSupabaseClient } from '../../utils/supabaseclient';

export class SessionService {
  private static instance: SessionService;

  private constructor() {}

  public static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  async saveSession(session: Session): Promise<void> {
    await SecureStore.setItemAsync('supabase_session', JSON.stringify(session));
  }

  async getSession(): Promise<Session | null> {
    const sessionStr = await SecureStore.getItemAsync('supabase_session');
    return sessionStr ? JSON.parse(sessionStr) : null;
  }

  async clearSession(): Promise<void> {
    await SecureStore.deleteItemAsync('supabase_session');
  }

  async refreshSession(): Promise<Session | null> {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('Fehler beim Aktualisieren der Session:', error);
      return null;
    }
    if (data.session) {
      await this.saveSession(data.session);
      return data.session;
    }
    return null;
  }

  async restoreSession(): Promise<boolean> {
    const sessionService = SessionService.getInstance();
    const session = await sessionService.getSession();
    
    if (session) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.setSession(session);
      
      if (error) {
        console.error('Fehler beim Wiederherstellen der Session:', error);
        await sessionService.clearSession();
        return false;
      }
      
      if (data.session) {
        await sessionService.saveSession(data.session);
        return true;
      }
    }
    
    return false;
  }

  async getAccessToken(): Promise<string | null> {
    const session = await this.getSession();
    return session ? session.access_token : null;
  }
}