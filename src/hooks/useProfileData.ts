import { useState, useEffect } from 'react';
import { User } from '../types/auth';
import { Post } from '../types/post';
import { getUserData } from '../services/auth/AuthStoreHelpers';

export const useProfileData = (userId: string | null, postData: string | null) => {
  const [user, setUser] = useState<User | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (userId === 'current') {
          const currentUser = await getUserData();
          setUser(currentUser);
        } else if (postData) {
          const parsedPost = JSON.parse(postData) as Post;
          setPost(parsedPost);
          const postUser: User = {
            id: parsedPost.userId,
            vorname: parsedPost.vorname,
            nachname: parsedPost.nachname,
            bio: parsedPost.userBio,
            email: parsedPost.email,
            created_at: parsedPost.created_at,
            location: parsedPost.location,
            profileImage: parsedPost.userProfileImage,
            coverImage: parsedPost.userCoverImage,

            // Fügen Sie hier weitere benötigte Benutzerfelder hinzu
          };
          setUser(postUser);
        }
      } catch (err) {
        setError('Fehler beim Laden der Daten');
        console.error('Fehler beim Laden der Daten:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId, postData]);

  return { user, post, loading, error };
};