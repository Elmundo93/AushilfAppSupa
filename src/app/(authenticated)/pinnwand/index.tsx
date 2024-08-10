import React, { useEffect, useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import { createRStyle } from 'react-native-full-responsive';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchPosts } from '@/src/components/Cruid/Post/FetchPost';
import { FlatList } from 'react-native-gesture-handler';
import { usePostStore } from '@/src/stores/postStores';
import {
  Platform,
  UIManager,
  LayoutAnimation
} from 'react-native';
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { Post } from '@/src/types/post';
import PinnwandHeader from '@/src/components/Pinnwand/PinnwandHeader';
import { applyFilters } from '@/src/utils/FilterLogic';
import FilterAccordion from '@/src/components/Accordion/FilterAccordion';
import { handleSuchenBietenChange, handleCategoryChange } from '@/src/utils/FilterHelpers';
import CustomCheckbox from '@/src/components/Checkboxes/CustomCheckbox';
import PostItem from '@/src/components/Pinnwand/PostItem';
import RefreshHandler from '@/src/components/Pinnwand/RefreshHandler';

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
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [postCount]);

  const applyFiltersCallback = useCallback(() => {
    const filtered = applyFilters(
      posts,
      suchenChecked,
      bietenChecked,
      gartenChecked,
      haushaltChecked,
      sozialesChecked,
      gastroChecked
    );
    setFilteredPosts(filtered);
  }, [posts, suchenChecked, bietenChecked, gartenChecked, haushaltChecked, sozialesChecked, gastroChecked]);


  useEffect(() => {
    applyFiltersCallback();
  }, [applyFiltersCallback]);


  const handleSuchenBietenChangeCallback = useCallback((option: string) => {
    handleSuchenBietenChange(option, suchenChecked, bietenChecked, setSuchenChecked, setBietenChecked);
  }, [suchenChecked, bietenChecked]);

  const handleCategoryChangeCallback = useCallback((category: string) => {
    handleCategoryChange(category, setGartenChecked, setHaushaltChecked, setSozialesChecked, setGastroChecked);
  }, []);


  const handleRefreshComplete = useCallback((refreshedPosts: Post[]) => {
    setPosts(refreshedPosts);
    setFilteredPosts(refreshedPosts);
  }, []);


  const renderCheckbox = useCallback((label: string, isChecked: boolean, onCheck: () => void) => (
    <CustomCheckbox
      key={label}
      label={label}
      isChecked={isChecked}
      onCheck={onCheck}
    />
  ), []);


  const renderItem = useCallback(({ item }: { item: Post }) => {
    if (!item) {
      console.error('Item ist null oder undefiniert');
      return null;
    }
    return <PostItem item={item} />;
  }, []);
  

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
              <PinnwandHeader />
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
                handleSuchenBietenChange={handleSuchenBietenChangeCallback}
                handleCategoryChange={handleCategoryChangeCallback}
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
            <RefreshHandler onRefreshComplete={handleRefreshComplete} />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = createRStyle({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: '-25rs',
  },
  loaderContainer: {
    justifyContent: 'space-between'
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