import { User as SupabaseUser, Session } from '@supabase/supabase-js';

// Benutzer-Typ
export interface User {
  id: string;
  email: string;
  vorname: string;
  nachname: string;
  created_at: string;
  location: string;
  bio: string;
  profileImage: string;
  coverImage: string;

  // Weitere Benutzerfelder hier
}

// Verwenden Sie den Session-Typ direkt von Supabase
export { Session };

// AuthResult-Typ, der den Supabase Session-Typ verwendet
export interface AuthResult {
  user: SupabaseUser | null;
  session: Session | null;
  error: Error | null;
}

export interface StreamChatData {
    apiKey: string;
    userId: string;
    token: string;
  }