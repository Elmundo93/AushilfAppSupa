import { getSupabaseClient } from '../../utils/supabaseclient';
import { User } from '../../types/auth';
import { SupabaseClient } from '@supabase/supabase-js';

export class UserService {
  private supabase: SupabaseClient | null = null;

  private async getSupabase(): Promise<SupabaseClient> {
    if (!this.supabase) {
      this.supabase = await getSupabaseClient();
    }
    return this.supabase;
  }

  async createUser(userData: User): Promise<User> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('User')
      .insert(userData)
      .single();
    if (error) throw error;
    return data;
  }
  async getUserById(userId: string): Promise<User> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async saveUserData(userData: User): Promise<void> {
    // Implementieren Sie hier die Logik zum lokalen Speichern der Benutzerdaten
  }

  async deleteUserData(): Promise<void> {
    // Implementieren Sie hier die Logik zum Löschen der lokalen Benutzerdaten
  }
}