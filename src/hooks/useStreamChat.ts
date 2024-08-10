import { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import { User } from '../types/auth';
import { StreamChatService } from '../services/chat/StreamChatService';

export const useStreamChat = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [streamClient, setStreamClient] = useState<StreamChat | null>(null);
  const streamChatService = StreamChatService.getInstance();

  useEffect(() => {
    const initializeStreamChat = async () => {
      const { currentUser, streamClient } = await streamChatService.initializeStreamChat();
      setCurrentUser(currentUser);
      setStreamClient(streamClient);
    };

    initializeStreamChat();

    return () => {
      streamChatService.disconnectUser();
    };
  }, []);

  return { currentUser, streamClient, streamChatService };
};