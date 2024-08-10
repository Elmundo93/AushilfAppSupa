import { AuthService } from '../../services/auth/AuthServices';
import { StreamChatService } from '../../services/chat/StreamChatService';
import { User } from '../../types/auth';

const authService = AuthService.getInstance();
const streamChatService = StreamChatService.getInstance();

export const signUp = async (email: string, password: string, userData: Omit<User, 'id'>) => {
  return authService.signUp(email, password, userData);
};

export const signIn = async (email: string, password: string) => {
  const { data: userData, error: authError } = await authService.signIn(email, password);

  if (authError || !userData) {
    return { data: null, error: authError };
  }

  const { data: streamData, error: streamError } = await streamChatService.generateToken(userData.id);

  if (streamError || !streamData) {
    return { data: null, error: streamError };
  }

  await streamChatService.connectUser(userData, streamData.apiKey, streamData.token);

  return { data: userData, error: null };
};

export const signOut = async () => {
  await streamChatService.disconnectUser();
  return authService.signOut();
};