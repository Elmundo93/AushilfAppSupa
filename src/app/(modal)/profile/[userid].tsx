import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native';
import ProfileAvatar from '../../../components/ProfileImage/ProfileAvatar';
import { RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useCallback } from 'react';

import { TouchableOpacity } from 'react-native';
import { createRStyle } from 'react-native-full-responsive';
import LottieView from 'lottie-react-native';



interface Post {
  id: string;
  userid: string;
  category: string;
  created_at: string;
  location: string;
  nachname: string;
  option: string;
  postText: string;
  vorname: string;
  profilImage: string;
  bio: string;
}

interface UserDetails {
  vorname: string;
  nachname: string;
  location: string;
  profilImage: string;
  id: string;
  bio: string;
}

interface Danksagung {
  id: string;
  text: string;
  author: string;
}

const UserProfile: React.FC = () => {
  const { post } = useLocalSearchParams();
  const [userPost, setUserPost] = useState<Post | null>(null);
  const [newDanksagung, setNewDanksagung] = useState('');

  const [refreshing, setRefreshing] = useState(false);

  const [danksagungen, setDanksagungen] = useState<Danksagung[]>([
    { id: '1', text: 'Vielen Dank für deine Hilfe!', author: 'Max Mustermann' },
    { id: '2', text: 'Du bist ein echter Lebensretter!', author: 'Anna Schmidt' },
    { id: '3', text: 'Deine Unterstützung bedeutet mir sehr viel.', author: 'Lisa Meyer' },
    { id: '4', text: 'Danke für dein Engagement in der Gemeinschaft!', author: 'Tom Schulz' },
    { id: '5', text: 'Du machst einen tollen Job!', author: 'Sarah Wagner' },
  ]);


  const formatName = (vorname: string, nachname: string) => 
    `${vorname} ${nachname.charAt(0)}.`;

  useEffect(() => {
    if (post) {
      try {
        const parsedPost = JSON.parse(post as string) as Post;
        setUserPost(parsedPost);
      } catch (error) {
        console.error('Fehler beim Parsen der Post-Daten:', error);
      }
    }
  }, [post]);

  if (!userPost) {
    return <Text>Lade Benutzerprofil...</Text>;
  }

  const renderDanksagung = ({ item }: { item: Danksagung }) => (
    <View style={styles.danksagungCard}>
      <Text style={styles.danksagungText}>{item.text}</Text>
      <Text style={styles.danksagungAuthor}>- {item.author}</Text>
    </View>
  );


  const renderHeader = (item: UserDetails) => (
    <View style={styles.header}>
      <View style={styles.userInfoCard}>
      <View>
      <ProfileAvatar style={styles.profileImage} />

      <Text style={styles.userName}>{formatName(userPost.vorname, userPost.nachname)}</Text>
      </View>
      <Text style={styles.userBio}>{userPost.bio}</Text>
      </View>
      <View style={styles.trenner}/>
      <View style={styles.trenner2}/>
      
      <View style={styles.danksagungenHeader}>
      <Text style={styles.danksagungenTitle}>Danksagungen</Text>
    </View>

      <View style={styles.inputCard}>
      <TextInput
        style={styles.input}
        placeholder="Schreibe eine Danksagung..."
        value={newDanksagung}
        onChangeText={setNewDanksagung}
        multiline
      />
      </View>
      <TouchableOpacity style={styles.button} onPress={() => alert('Danksagung abgeschickt!')}>
          <Text style={styles.buttonText}>Abschicken</Text>
        </TouchableOpacity>
        <View style={styles.lottieContainer}>
        <LottieView
            source={require('@/assets/animations/SpinnigGreenArrow.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
        <LottieView
          source={require('@/assets/animations/SpinnigGreenArrow.json')}
          autoPlay
          loop
          style={styles.lottie}
        /> 
        </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <FlatList
      ListHeaderComponent={renderHeader}
        data={danksagungen}
        renderItem={renderDanksagung}
        keyExtractor={(item) => item.id}
        style={styles.danksagungList}
        ListEmptyComponent={ <View style={{borderWidth:1,borderRadius:25, backgroundColor:'green', justifyContent:'center', alignContent:'center', margin:25, padding:20}}><Text style={{color:'white', alignSelf:'center', fontSize:30}} >Kein Eintrag fr diese Kategorie gefunden 🤷</Text><Text style={{color:'white', alignSelf:'center', fontSize:30, marginTop:20}}>Bitte wähle einen anderen Filter!✌️</Text></View>}


          
        
      />
    </View>
  );
};

const styles = createRStyle({
  container: {
    flex: 1,
    padding: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 16,
  },
  trenner: {
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 16,
    opacity: 0.5,
    width: '320rs',
  },
  trenner2: {
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 16,
    opacity: 0.5,
    width: '300rs',
    alignSelf: 'center',
  },
  userInfoCard: {
    padding: 16,
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userBio: {
    fontSize: 16,
  },
  inputCard: {
    marginBottom: 16,
  },
  input: {
    padding: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 55,
    width: '300rs',
    alignSelf: 'center',
  },
  lottieContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  lottie: {
    alignSelf: "center",
    width: 100,
    height: 100,
    zIndex: 100,
    transform: [{ rotate: '180deg' }],
    color: 'green',
  },
  danksagungList: {
    flex: 1,
  },
  danksagungCard: {
    padding: 16,
    marginBottom: 8,
  },
  danksagungText: {
    fontSize: 16,
    marginBottom: 4,
  },
  danksagungAuthor: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'right',
  }, 
  header: {
    marginBottom: 20,
  },

  button: {
    backgroundColor: 'green',
    borderRadius: 5,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  danksagungenHeader: {
    marginBottom: 16,
    alignItems: 'center',
  },
  danksagungenTitle: {
    fontSize: '24rs',
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 8,
    letterSpacing: 2,
  },
  danksagungenUnderline: {
    height: 2,
    width: '80rs',
    backgroundColor: '#007AFF',
  },

});

export default UserProfile;