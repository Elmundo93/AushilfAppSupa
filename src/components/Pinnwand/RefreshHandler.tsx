import React, { useCallback, useState } from 'react';
import { RefreshControl } from 'react-native';
import { refreshPosts } from '@/src/components/Cruid/Post/FetchPost';
import { Post } from '@/src/types/post';

interface RefreshHandlerProps {
  onRefreshComplete: (refreshedPosts: Post[]) => void;
}

const RefreshHandler: React.FC<RefreshHandlerProps> = ({ onRefreshComplete }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(0);

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
      onRefreshComplete(refreshedPosts);
      setLastRefreshTime(currentTime);
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Posts:", error);
    } finally {
      setRefreshing(false);
    }
  }, [lastRefreshTime, onRefreshComplete]);

  const getRemainingRefreshTime = useCallback(() => {
    const currentTime = Date.now();
    const fiveMinutesInMs = 5 * 60 * 1000;
    const timeSinceLastRefresh = currentTime - lastRefreshTime;
    const remainingTime = Math.max(0, fiveMinutesInMs - timeSinceLastRefresh);
    return Math.ceil(remainingTime / 1000);
  }, [lastRefreshTime]);

  return (
    <RefreshControl 
      refreshing={refreshing} 
      onRefresh={onRefresh}
      title={getRemainingRefreshTime() > 0 ? `Warten Sie ${getRemainingRefreshTime()} Sekunden` : 'Zum Aktualisieren ziehen'}
    />
  );
};

export default RefreshHandler;