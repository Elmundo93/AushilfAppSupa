import { getSupabaseClient } from '../../utils/supabaseclient';
import { SupabaseClient } from '@supabase/supabase-js';

export class TokenService {
  private static instance: TokenService;
  private supabase: SupabaseClient | null = null;

  private constructor() {}

  public static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  private async getSupabase(): Promise<SupabaseClient> {
    if (!this.supabase) {
      this.supabase = await getSupabaseClient();
    }
    return this.supabase;
  }

  async generateStreamToken(userId: string) {
    const supabase = await this.getSupabase();
    const { data: streamData, error: streamError } = await supabase.functions.invoke('generate-getStream-token', {
      body: { userId },
    });

    if (streamError) {
      console.error('Fehler beim Generieren des GetStream-Tokens:', streamError);
      return { data: null, error: streamError };
    }

    return { data: streamData, error: null };
  }
}