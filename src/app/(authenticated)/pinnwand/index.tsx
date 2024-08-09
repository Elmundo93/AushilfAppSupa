import React, { useEffect, useState, useCallback } from 'react';
import { View, Image, Text, RefreshControl } from 'react-native';
import { createRStyle } from 'react-native-full-responsive';
import LottieView from 'lottie-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchPosts, refreshPosts } from '@/src/components/Cruid/Post/FetchPost';
import { useRouter } from 'expo-router';
import { TouchableOpacity, FlatList, TouchableHighlight } from 'react-native-gesture-handler';
import Entypo from '@expo/vector-icons/Entypo';
import { usePostStore } from '@/src/stores/postStores';

import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FilterAccordion from '@/src/components/Accordion/FilterAccordion';
import {
  Platform,
  UIManager,
  LayoutAnimation
} from 'react-native';
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
interface Post {
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
}

const PinnwandFilters: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [suchenChecked, setSuchenChecked] = useState(false);
  const [bietenChecked, setBietenChecked] = useState(false);
  const [gartenChecked, setGartenChecked] = useState(false);
  const [haushaltChecked, setHaushaltChecked] = useState(false);
  const [sozialesChecked, setSozialesChecked] = useState(false);
  const [gastroChecked, setGastroChecked] = useState(false);
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(0);
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
  const postCount = usePostStore((state) => state.postCount);

  const toggleAccordion = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsAccordionExpanded(!isAccordionExpanded);
  }, [isAccordionExpanded]);


  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const postsList = await fetchPosts();
        setPosts(postsList);
        setFilteredPosts(postsList);
      } catch (error) {
        console.error('Fehler beim Laden der Posts:', error);
        // Hier könnten Sie eine Benutzerbenachrichtigung hinzufügen
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [postCount]);

  const applyFilters = useCallback(() => {
    let filtered = posts;

    if (suchenChecked || bietenChecked) {
      filtered = filtered.filter(post =>
        suchenChecked ? post.option === 'suchen' : post.option === 'bieten'
      );
    }

    const categories = [
      gartenChecked ? 'garten' : '',
      haushaltChecked ? 'haushalt' : '',
      sozialesChecked ? 'soziales' : '',
      gastroChecked ? 'gastro' : '',
    ].filter(Boolean);

    if (categories.length > 0) {
      filtered = filtered.filter(post => categories.includes(post.category));
    }

    setFilteredPosts(filtered);
  }, [posts, suchenChecked, bietenChecked, gartenChecked, haushaltChecked, sozialesChecked, gastroChecked]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSuchenBietenChange = (option: string) => {
    if (option === 'suchen') {
      setSuchenChecked(!suchenChecked);
      setBietenChecked(false);
    } else if (option === 'bieten') {
      setBietenChecked(!bietenChecked);
      setSuchenChecked(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    if (category === 'garten') {
      setGartenChecked(!gartenChecked);
      setHaushaltChecked(false);
      setSozialesChecked(false);
      setGastroChecked(false);
    }
    if (category === 'haushalt') {
      setGartenChecked(false);
      setHaushaltChecked(!haushaltChecked);
      setSozialesChecked(false);
      setGastroChecked(false);
    }
    if (category === 'soziales') {
      setGartenChecked(false);
      setHaushaltChecked(false);
      setSozialesChecked(!sozialesChecked);
      setGastroChecked(false);
    }
    if (category === 'gastro') {
      setGartenChecked(false);
      setHaushaltChecked(false);
      setSozialesChecked(false);
      setGastroChecked(!gastroChecked);
    }
  };

  const getCheckboxImage = (label: string) => {
    switch (label) {
      case 'Garten':
        return require('@/assets/images/GartenIcon.png');
      case 'Haushalt':
        return require('@/assets/images/HaushaltIcon.png');
      case 'Soziales':
        return require('@/assets/images/SozialesIcon.png');
      case 'Gastro':
        return require('@/assets/images/GastroIcon.png');
      case 'Suchen':
        return require('@/assets/images/LookingFor.png');
      case 'Bieten':
        return require('@/assets/images/RaisingHand.png');
      default:
        return require('@/assets/images/GastroIcon.png');
    }
  };

  const getUnderlayColor = (label: string) => {
    switch (label) {
      case 'Garten':
        return 'lightgreen';
      case 'Haushalt':
        return 'lightblue';
      case 'Soziales':
        return 'rgb(255, 102, 102)';
      case 'Gastro':
        return 'rgb(255, 255, 102)';
      case 'Bieten':
        return 'green';
      case 'Suchen':
        return 'orange';
      default:
        return 'grey';
    }
  };
  const onRefresh = useCallback(async () => {
    const currentTime = Date.now();
    const fiveMinutesInMs = 5 * 60 * 1000;

    if (currentTime - lastRefreshTime < fiveMinutesInMs) {
      alert('Bitte warten Sie 5 Minuten, bevor Sie erneut aktualisieren.');
      return;
    }
  
    setRefreshing(true);
    try {
      const refreshedPosts = await refreshPosts();
      setPosts(refreshedPosts);
      setFilteredPosts(refreshedPosts);
      setLastRefreshTime(currentTime);
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Posts:", error);
      // Hier könnten Sie eine Benutzerbenachrichtigung hinzufügen
    } finally {
      setRefreshing(false);
    }
  }, [lastRefreshTime]);

  const getRemainingRefreshTime = useCallback(() => {
    const currentTime = Date.now();
    const fiveMinutesInMs = 5 * 60 * 1000;
    const timeSinceLastRefresh = currentTime - lastRefreshTime;
    const remainingTime = Math.max(0, fiveMinutesInMs - timeSinceLastRefresh);
    return Math.ceil(remainingTime / 1000); // Verbleibende Zeit in Sekunden
  }, [lastRefreshTime]);

  const renderCheckbox = (label: string, isChecked: boolean, onCheck: () => void) => (
    <View style={styles.checkboxContainer}>
      <Text style={styles.checkboxLabel}>{label}</Text>
    <TouchableHighlight
      key={label}
      onPress={onCheck}
      style={[styles.checkboxBox, { backgroundColor: isChecked ? getUnderlayColor(label) : 'transparent' }]}
      underlayColor={getUnderlayColor(label)}
      activeOpacity={0.6}
    >

      <Image source={getCheckboxImage(label)} style={styles.checkboxBoxImage} resizeMode="contain" />
    </TouchableHighlight>
    </View>
  );


  const renderHeader = () => (
    <View>
      <View style={styles.headerContainer}>
        <Text style={styles.welcomeText}>Wilkommen auf der Pinnwand!</Text>
        <Text style={styles.welcomeText2}>Starte deine Suche und </Text>
        <TouchableOpacity style={styles.modalButton} onPress={() => router.push('/(modal)/createPost')}>
          <Text style={styles.modalButtonText}>Verfasse einen Pinnwandbeitrag!</Text>
          <Entypo name="new-message" size={30} color="white" style={styles.modalButtonIcon} />
        </TouchableOpacity>
 
        
      </View>
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
        <LottieView
        source={require('@/assets/animations/SpinnigGreenArrow.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
        </View>

        
      
     
    </View>
  );


  const renderItem = ({ item }: { item: Post }) => {
    if (!item) {
      console.error('Item ist null oder undefiniert');
      return null;
    }
  
    const handleWriteMessage = () => {
      alert('Nachricht schreiben');
    };
  
    const handleViewProfile = () => {
      router.push({
        pathname: '/(modal)/profile/[userid]',
        params: { userid: item.userid , post: JSON.stringify(item) },
      })
    };
  
    const handleReportPost = () => {
      const name = item?.vorname || 'Benutzer';
      alert(`${name}s Post melden`);
    };
    const getOptionIcon = (option: string) => {
      switch (option) {
        case 'bieten':
          return require('@/assets/images/RaisingHandBackgroundColor.png');
        case 'suchen':
          return require('@/assets/images/LookingForBackgroundColor.png');
        default:
          return require('@/assets/images/bienenlogo.png');
      }
    };
  
    const getCategoryIcon = (category: string) => {
      switch (category) {
        case 'gastro':
          return require('@/assets/images/GastroIconBackgroundColor.png');
        case 'garten':
          return require('@/assets/images/GartenIconBackgroundColor.png');
        case 'haushalt':
          return require('@/assets/images/HaushaltIconBackgroundColor.png');
        case 'soziales':
          return require('@/assets/images/SozialesIconBackgroundColor.png');
        default:
          return require('@/assets/images/bienenlogo.png');
      }
    };
  
    const optionIcon = getOptionIcon(item.option);
    const categoryIcon = getCategoryIcon(item.category);

    const menuOptionsStyles = {
      optionsWrapper: styles.optionsWrapper,
      optionsContainer: styles.optionsContainer,
      optionWrapper: styles.optionWrapper,
      optionText: styles.optionText,
      OptionTouchableComponent: TouchableHighlight, // or any other component
      optionTouchable: {
        activeOpacity: 0.5,
        underlayColor: 'rgba(0,0,0,0.1)'
      }
    };
  
    return (
      <View>
        <View style={styles.stringscontainer}>
          <Image source={require('@/assets/images/PinnwandHeader.png')} style={styles.strings} />
          <Menu style={styles.stringsButton}>
      <MenuTrigger>
        <MaterialCommunityIcons name="dots-horizontal-circle-outline" size={24} color="black" />
      </MenuTrigger>
      <MenuOptions customStyles={menuOptionsStyles}>
        <MenuOption onSelect={handleWriteMessage} text="Nachricht schreiben" />
        <MenuOption onSelect={handleViewProfile} text="Profil anzeigen" />
        <MenuOption onSelect={handleReportPost} text="Post melden" />
      </MenuOptions>
    </Menu>
        </View>
        <View style={styles.post}>
          <View style={styles.iconContainer}>
            <Image source={require('@/assets/images/bienenlogo.png')} style={styles.icon} />
            <Image source={optionIcon} style={styles.icon} />
            <Image source={categoryIcon} style={styles.icon} />
          </View>
          <View style={styles.headerContainerPost}>
            <View style={styles.header}>
              <Text style={styles.name}>
                {item.vorname} {item.nachname?.charAt(0)}.
              </Text>
              <Text style={styles.location}>{item.location}</Text>
              <Text style={styles.date}>
                {new Date(item.created_at).getDate().toString().padStart(2, '0')}.
                {(new Date(item.created_at).getMonth() + 1).toString().padStart(2, '0')}
              </Text>
            </View>
            <View style={styles.postContainer}>
              <Text style={styles.postText} numberOfLines={3}>
                {item.postText}
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  router.push({
                    pathname: '/(modal)/postDetail/[postID]',
                    params: { postID: item.id, post: JSON.stringify(item) },
                  })
                }
              >
                <Text style={styles.buttonText}>Beitrag ansehen!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <Text>Lädt...</Text>
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={
            <>
              {renderHeader()}
              <FilterAccordion 
                isExpanded={isAccordionExpanded}
                onToggle={toggleAccordion}
                renderCheckbox={renderCheckbox}
                suchenChecked={suchenChecked}
                bietenChecked={bietenChecked}
                gartenChecked={gartenChecked}
                haushaltChecked={haushaltChecked}
                sozialesChecked={sozialesChecked}
                gastroChecked={gastroChecked}
                handleSuchenBietenChange={handleSuchenBietenChange}
                handleCategoryChange={handleCategoryChange}
              />
            </>
          }
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.emptyListContainer}>
              <Text style={styles.emptyListText}>Kein Eintrag für diese Kategorie gefunden 🤷</Text>
              <Text style={styles.emptyListText}>Bitte wähle einen anderen Filter!✌️</Text>
            </View>
          }
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              title={getRemainingRefreshTime() > 0 ? `Warten Sie ${getRemainingRefreshTime()} Sekunden` : 'Zum Aktualisieren ziehen'}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};



const styles = createRStyle({
  checkboxContainer: {
position: 'relative',
    alignItems: 'center',
    marginVertical: '10rs',
  },
  checkboxLabel: {
    fontSize: '9rs',
    color: '#333',
    fontWeight: '500',
    position: 'absolute',
    backgroundColor: 'white',
    top:'-1rs'   
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: '-25rs',

  },
  optionsWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '15rs',
    padding: '10rs',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: '8rs',
    elevation: 5,
  },
  optionsContainer: {
    width: '200rs',
  },
  optionWrapper: {
    padding: '12rs',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: '16rs',
    color: '#333',
    fontWeight: '500',
  },
  headerContainer: {
    marginVertical: '20rs',
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: '10rs',
    paddingVertical: '10rs',
    marginBottom: '10rs',
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: '25rs',
  },
  filtersText: {
    position: 'absolute',
    top: '-18rs',
    left: '18rs',
    fontSize: '16rs',
    color: '#333',
    fontWeight: '500',
    backgroundColor: 'white',
    
    paddingVertical: '5rs',
    borderRadius: '25rs',
  },
  trenner: {
    width: 10,
    marginHorizontal: '8rs',
    backgroundColor: 'lightgrey',
    height: '80%',
    borderRadius: '25rs',
    alignSelf: 'center',
  },
  loaderContainer: {
    
    justifyContent: 'space-between'
  },
  checkboxBox: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgrey',
    margin: 10
  },
  checkboxBoxImage: {
    width: '45rs',
    height: '45rs'
  },
  pinnwandColor: {
    color: 'amber', },
    
  lottieContainer : {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',

    },

    lottie: {
    alignSelf: 'center',
    width: '100rs',
    height: '40rs',
    zIndex: 1000,
    transform: [{ rotate: '180deg' }],


  },
  
  createPostTextContainer: {

    marginTop: '90rs',
  },
welcomeText: {
  fontSize: '24rs',
  fontWeight: 'bold',
  marginBottom: '10rs',
  alignSelf: 'center',

},

welcomeText2: {
  fontSize: '24rs',
  alignSelf: 'center',
  fontWeight: 'bold'},

  modalLink: {
    color: 'white',
    fontSize: '24rs',
    fontWeight: 'bold',
  },

  modalButton: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 25,
    paddingVertical: '10rs',
    marginTop: '10rs',
    width: '330rs',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
    alignSelf: 'center',
    flexDirection: 'row',
    shadowColor: 'green',
    elevation: 2,
    shadowRadius: 3,
    shadowOpacity: 0.2, 
  },
  modalButtonIcon: {
    paddingLeft: '15rs',
  },
  modalButtonText: {
    color: 'white',
    fontSize: '24rs',
    fontWeight: 'bold',
    
  },
  menuOptions: {
   position: 'absolute',
    top: 10,
    left: 100,

    padding: 5,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stringscontainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  strings: {
    width: 100,
    height: 50,
    position: 'absolute',
    bottom: 0,
  },
  stringsButton: {
    position: 'absolute',
    bottom: 18,

  },
  post: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,

  },
  iconContainer: {
    alignItems: 'center',
    marginRight: 10,
  },
  icon: {
    width: 30,
    height: 30,
    marginBottom: 5,
    borderRadius: 5,
  },
  headerContainerPost: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    width: '100%', // Stellt sicher, dass der Header die volle Breite einnimmt
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1, // Erlaubt dem Namen, den verfügbaren Platz einzunehmen
  },
  location: {
    fontSize: 12,
    color: '#555',
    marginLeft: 'auto', // Schiebt den Standort nach rechts
  },
  date: {
    fontSize: 12,
    color: '#555',
    marginLeft: 10, // Fügt etwas Abstand zwischen Standort und Datum hinzu
  },
  postContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  postText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    textAlign: 'left',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 10
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },


  containerPost: {
    flex: 1,
  },
  listContainer: {
    padding: 15,
  },
  emptyListContainer: {
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignContent: 'center',
    margin: 25,
    padding: 20,
  },
  emptyListText: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 30,
  },

});

export default PinnwandFilters;