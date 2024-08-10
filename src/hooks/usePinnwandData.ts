import { useState, useEffect, useCallback } from 'react';
import { fetchPosts, refreshPosts } from '../components/Cruid/Post/FetchPost';
import { Post } from '../types/post';
import { usePostStore } from '../stores/postStores';

export const usePinnwandData = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const postCount = usePostStore((state) => state.postCount);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
      setFilteredPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const currentTime = Date.now();
      if (currentTime - lastRefreshTime > 60000) {
        const refreshedPosts = await refreshPosts();
        setPosts(refreshedPosts);
        setFilteredPosts(refreshedPosts);
        setLastRefreshTime(currentTime);
      }
    } catch (error) {
      console.error('Error refreshing posts:', error);
    } finally {
      setRefreshing(false);
    }
  }, [lastRefreshTime]);

  const applyFilters = useCallback(() => {
    let filtered = posts;
    if (selectedOption) {
      filtered = filtered.filter(post => post.option === selectedOption);
    }
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    if (selectedLocation) {
      filtered = filtered.filter(post => post.location === selectedLocation);
    }
    setFilteredPosts(filtered);
  }, [posts, selectedOption, selectedCategory, selectedLocation]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
  };

  return {
    posts,
    filteredPosts,
    loading,
    refreshing,
    lastRefreshTime,
    selectedOption,
    selectedCategory,
    selectedLocation,
    postCount,
    onRefresh,
    handleOptionChange,
    handleCategoryChange,
    handleLocationChange,
  };
};