import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import ProfileImage from '@/src/components/ProfileImage/PostProfile';
import * as SecureStore from 'expo-secure-store';
import { StreamChat } from 'stream-chat';




interface Post {
  id: string;
  userId: string;
  category: string;
  created_at: string;
  location: string;
  nachname: string;
  option: string;
  postText: string;
  vorname: string;
  profilImage: string;
}

interface UserDetails {
  vorname: string;
  nachname: string;
  location: string;
  profilImage: string;
  id: string;
}

const formatName = (vorname: string, nachname: string) => {
  return `${vorname} ${nachname.charAt(0)}.`;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(2);
  return `${day}.${month}.${year}`;
};



export default function PostDetail() {
  const { post } = useLocalSearchParams();
  const postDetails: Post = JSON.parse(post as string);
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserDetails | null>(null);
  const [streamClient, setStreamClient] = useState<StreamChat | null>(null);

  useEffect(() => {
    const initializeStreamChat = async () => {
      try {
        const userDataString = await SecureStore.getItemAsync('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setCurrentUser(userData);

          // Prüfen, ob bereits ein Client existiert
          if (!streamClient) {
            const client = new StreamChat('IHRE_GETSTREAM_API_KEY');
            await client.connectUser(
              {
                id: userData.id,
                name: `${userData.vorname} ${userData.nachname}`,
                // Fügen Sie hier weitere Benutzerdetails hinzu, falls erforderlich
              },
              userData.streamToken
            );
            setStreamClient(client);
          }
        }
      } catch (error) {
        console.error('Fehler beim Initialisieren des StreamChat:', error);
        Alert.alert('Fehler', 'Beim Laden der Chat-Daten ist ein Fehler aufgetreten.');
      }
    };

    initializeStreamChat();

    // Kein Cleanup mehr nötig
  }, []);

  const handleChatPress = async () => {
    if (!currentUser) {
      Alert.alert('Fehler', 'Bitte melden Sie sich an, um eine Nachricht zu senden.');
      return;
    }
  
    if (!streamClient) {
      Alert.alert('Fehler', 'Chat-Client konnte nicht initialisiert werden. Bitte versuchen Sie es später erneut.');
      return;
    }
  
    try {
      const channelId = `${currentUser.id}_${postDetails.userId}_${Date.now()}`;
      const channel = streamClient.channel('messaging', channelId, {
        members: [currentUser.id, postDetails.userId],
        created_by: {
          id: currentUser.id,
          name: `${currentUser.vorname} ${currentUser.nachname}`,
          // Fügen Sie hier weitere relevante Informationen hinzu
        },
        postVorname: postDetails.vorname,
        postNachname: postDetails.nachname,
        postLocation: postDetails.location,
        postOption: postDetails.option,
        postCategory: postDetails.category,
        userVorname: currentUser.vorname,
        userNachname: currentUser.nachname,
        userLocation: currentUser.location,
        userProfilImage: currentUser.profilImage,
        postProfilImage: postDetails.profilImage,
      });
  
      await channel.create();
  
      router.push({
        pathname: '/nachrichten/channel/[cid]' as never,
        params: { cid: channelId }
      });
    } catch (error) {
      console.error('Fehler beim Starten des Chats:', error);
      Alert.alert('Fehler', 'Fehler beim Starten des Chats. Bitte versuchen Sie es später erneut.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerProfileContainer}>
      <Text style={styles.headerText}>
          {formatName(postDetails.vorname, postDetails.nachname)}
        </Text>
        <ProfileImage imageUrl={postDetails.profilImage} />
        </View>
        <Text style={styles.headerText}>
          
          {`Aushilfe ${postDetails.option === 'bieten' ? 'geboten' : 'gesucht'} in ${postDetails.location} im Bereich ${postDetails.category.charAt(0).toUpperCase() + postDetails.category.slice(1)}`}
        </Text>
        
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.postText}>{postDetails.postText}</Text>
        <Text style={styles.dateText}>{formatDate(postDetails.created_at)}</Text>
      </View>
      <TouchableHighlight style={styles.button} onPress={handleChatPress}>
        <Text style={styles.buttonText}>Nachricht schreiben!</Text>
      </TouchableHighlight>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    marginBottom: 16,
  },
  headerProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: 18,
    color: 'gray',
  },
  contentContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 16,
    borderRadius: 8,
  },
  postText: {
    fontSize: 16,
  },
  dateText: {
    fontSize: 14,
    color: 'gray',
  },
  button: {
    padding: 16,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});