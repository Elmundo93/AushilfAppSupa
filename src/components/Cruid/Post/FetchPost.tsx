import { getSupabaseClient } from '../../../../supabaseclient';

// Definiere den Typ Post
type Post = {
  id: string;
  category: string;
  created_at: string;
  location: string;
  nachname: string;
  option: string;
  postText: string;
  vorname: string;
  profileImage: string;
  userid: string;
postId: string;
};

// Funktion zum Abrufen der Beiträge
export const fetchPosts = async (): Promise<Post[]> => {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('Posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw error;
    }

    return data as Post[];
  } catch (error) {
    console.error("Fehler beim Abrufen der Posts:", error);
    throw error;
  }
};

export const refreshPosts = async (): Promise<Post[]> => {
  try {
    const posts = await fetchPosts();
    console.log('Posts erfolgreich aktualisiert');
    return posts;
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Posts:", error);
    throw error;
  }
};