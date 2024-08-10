import { StreamChat } from 'stream-chat';
import { User } from '../../types/auth';
import {
  saveStreamChatData,
  deleteStreamChatData
} from '../auth/AuthStoreHelpers';
import { TokenService } from '../token/TokenService';
import * as SecureStore from 'expo-secure-store';
import { Post } from '../../types/post';

export class StreamChatService {
  private static instance: StreamChatService;
  private streamChatClient: StreamChat | null = null;
  private tokenService: TokenService;

  private constructor() {
    this.tokenService = TokenService.getInstance();
  }

  public static getInstance(): StreamChatService {
    if (!StreamChatService.instance) {
      StreamChatService.instance = new StreamChatService();
    }
    return StreamChatService.instance;
  }

  async generateToken(userId: string) {
    return this.tokenService.generateStreamToken(userId);
  }

  async connectUser(userData: User, apiKey: string, token: string) {
    this.streamChatClient = StreamChat.getInstance(apiKey);
    await this.streamChatClient.connectUser(
      {
        id: userData.id,
        name: `${userData.vorname} ${userData.nachname}`,
      },
      token
    );

    await saveStreamChatData(
      apiKey,
      userData.id,
      token
    );
  }

  async disconnectUser() {
    if (this.streamChatClient) {
      await this.streamChatClient.disconnectUser();
      this.streamChatClient = null;
    }
    await deleteStreamChatData();
  }

  getStreamChat(): StreamChat | null {
    return this.streamChatClient;
  }

  async initializeStreamChat() {
    try {
      const userDataString = await SecureStore.getItemAsync('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString) as User;

        if (!this.streamChatClient) {
          const { data: streamData, error } = await this.generateToken(userData.id);
          if (error || !streamData) {
            throw new Error('Fehler beim Generieren des StreamChat-Tokens');
          }
          await this.connectUser(userData, streamData.apiKey, streamData.token);
        }

        return { currentUser: userData, streamClient: this.streamChatClient };
      }
    } catch (error) {
      console.error('Fehler beim Initialisieren des StreamChat:', error);
    }
    return { currentUser: null, streamClient: null };
  }

  async handleChatPress(currentUser: User, postDetails: Post): Promise<string | null> {
    if (!this.streamChatClient) {
      throw new Error('Chat-Client konnte nicht initialisiert werden. Bitte versuchen Sie es später erneut.');
    }

    try {
      const channelId = `${currentUser.id}_${postDetails.userId}_${Date.now()}`;
      const channel = this.streamChatClient.channel('messaging', channelId, {
        members: [currentUser.id, postDetails.userId],
        created_by: {
          id: currentUser.id,
          name: `${currentUser.vorname} ${currentUser.nachname}`,
        },
        postVorname: postDetails.vorname,
        postNachname: postDetails.nachname,
        postLocation: postDetails.location,
        postOption: postDetails.option,
        postCategory: postDetails.category,
        userVorname: currentUser.vorname,
        userNachname: currentUser.nachname,
        userLocation: currentUser.location,
        userProfilImage: currentUser.profileImage,
        postProfilImage: postDetails.userProfileImage,
      });

      await channel.create();
      return channelId;
    } catch (error) {
      console.error('Fehler beim Starten des Chats:', error);
      throw new Error('Fehler beim Starten des Chats. Bitte versuchen Sie es später erneut.');
    }
  }
}