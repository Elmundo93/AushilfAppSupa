import {
    saveUserData,
    saveAuthToken,
    deleteAuthToken,
    deleteUserData,
    UserData,
    deleteStreamChatData,
    saveStreamChatData
  } from './AuthHelpers';
  import { getSupabaseClient } from '../../../supabaseclient';
  import {StreamChat} from 'stream-chat';


  let streamChatClient: StreamChat | null = null;
  
  export const signUp = async (email: string, password: string, userData: Omit<UserData, 'id'>) => {
    try {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (error) {
        return { data: null, error };
      }
  
      if (data.user) {
        // Warten Sie einen Moment, um sicherzustellen, dass der Benutzer vollständig erstellt wurde
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
          await saveAuthToken(data.session.access_token);
        }
  
        await saveUserData(insertedUser);
      }
  
      return { data, error: null };
    } catch (error) {
      console.error('Sign-up error:', error);
      return { data: null, error };
    }
  };
  export const signIn = async (email: string, password: string) => {
    try {
      const supabase = await getSupabaseClient();
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (authError) {
        return { data: null, error: authError };
      }
  
      if (authData.user) {
        // Benutzerdaten aus der Datenbank abrufen
        const { data: userData, error: fetchError } = await supabase
          .from('User')
          .select('*')
          .eq('id', authData.user.id)
          .single();
  
        if (fetchError) {
          console.error('Fehler beim Abrufen der Benutzerdaten:', fetchError);
          return { data: null, error: fetchError };
        }
  
        // GetStream-Token generieren
        const { data: streamData, error: streamError } = await supabase.functions.invoke('generate-getStream-token', {
          body: { userId: authData.user.id },
        });
  
        if (streamError) {
          console.error('Fehler beim Generieren des GetStream-Tokens:', streamError);
          return { data: null, error: streamError };
        }
  
        // Bei GetStream anmelden
        const client = StreamChat.getInstance(streamData.apiKey);
        await client.connectUser(
          {
            id: authData.user.id,
            name: `${userData.vorname} ${userData.nachname}`,
            // Fügen Sie hier weitere Benutzerdetails hinzu, falls erforderlich
          },
          streamData.token
        );
  
        // Sitzungstoken speichern
        if (authData.session) {
          await saveAuthToken(authData.session.access_token);
        }
  
        // Benutzerdaten lokal speichern
        await saveUserData(userData);
  
        // StreamChat-Daten speichern
        await saveStreamChatData(
          streamData.apiKey,
          authData.user.id,
          streamData.token
        );
  
  
        return { data: userData, error: null };
      }
  
      return { data: null, error: new Error('Keine Benutzerdaten verfügbar') };
    } catch (error) {
      console.error('Anmeldefehler:', error);
      return { data: null, error };
    }
  };
  

  export const signOut = async () => {
    try {
      const supabase = await getSupabaseClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
  
      // StreamChat-Client trennen
      if (streamChatClient) {
        await streamChatClient.disconnectUser();
        streamChatClient = null;
      }
  
      // Lokale Daten löschen
      await deleteAuthToken();
      await deleteUserData();
      await deleteStreamChatData();
  
      return { error: null };
    } catch (error) {
      console.error('Abmeldefehler:', error);
      return { error };
    }
  };