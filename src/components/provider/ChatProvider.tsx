import React, { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, OverlayProvider } from 'stream-chat-expo';
import * as SecureStore from 'expo-secure-store';

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  useEffect(() => {
    const loadChatClient = async () => {
      const apiKey = await SecureStore.getItemAsync('streamChatApiKey');
      const userId = await SecureStore.getItemAsync('streamChatUserId');
      const userToken = await SecureStore.getItemAsync('streamChatToken');

      if (apiKey && userId && userToken) {
        const client = StreamChat.getInstance(apiKey);
        await client.connectUser(
          {
            id: userId,
            // Weitere Benutzerdetails hier, falls nötig
          },
          userToken
        );
        setChatClient(client);
      }
    };

    loadChatClient();
  }, []);

  if (!chatClient) {
    return null; // Oder einen Ladeindikator anzeigen
  }

  return (
    <OverlayProvider>
      <Chat client={chatClient}>
        {children}
      </Chat>
    </OverlayProvider>
  );
};