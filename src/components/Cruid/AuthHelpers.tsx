import * as SecureStore from 'expo-secure-store';

export interface UserData {
  id: string;
  vorname: string;
  nachname: string;
  location: string;
  email: string;
  profileImage: string;
}
interface StreamChatData {
  token: string;
  apiKey: string;
  userId: string;
}

export async function saveUserData(userData: UserData) {
  try {
    await SecureStore.setItemAsync('userData', JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
}

export async function saveAuthToken(token: string) {
  try {
    await SecureStore.setItemAsync('authToken', token);
  } catch (error) {
    console.error('Error saving auth token:', error);
  }
}

export async function getAuthToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync('authToken');
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return null;
  }
}

export async function getUserData(): Promise<UserData | null> {
  try {
    const userDataString = await SecureStore.getItemAsync('userData');
    return userDataString ? JSON.parse(userDataString) : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
}

export async function deleteAuthToken() {
  try {
    await SecureStore.deleteItemAsync('authToken');
  } catch (error) {
    console.error('Error deleting auth token:', error);
  }
}

export async function deleteUserData() {
  try {
    await SecureStore.deleteItemAsync('userData');
  } catch (error) {
    console.error('Error deleting user data:', error);
  }
}

export async function saveStreamChatData(apiKey: string, userId: string, token: string) {
  try {
    await SecureStore.setItemAsync('streamChatApiKey', apiKey);
    await SecureStore.setItemAsync('streamChatUserId', userId);
    await SecureStore.setItemAsync('streamChatToken', token);
  } catch (error) {
    console.error('Fehler beim Speichern der Stream-Chat-Daten:', error);
  }
}
export async function getStreamChatData(): Promise<StreamChatData | null> {
  try {
    const apiKey = await SecureStore.getItemAsync('streamChatApiKey');
    const userId = await SecureStore.getItemAsync('streamChatUserId');
    const token = await SecureStore.getItemAsync('streamChatToken');
    
    if (apiKey && userId && token) {
      return { apiKey, userId, token };
    }
    return null;
  } catch (error) {
    console.error('Fehler beim Abrufen der Stream-Chat-Daten:', error);
    return null;
  }
}

export async function deleteStreamChatData() {
  try {
    await SecureStore.deleteItemAsync('streamChatApiKey');
    await SecureStore.deleteItemAsync('streamChatUserId');
    await SecureStore.deleteItemAsync('streamChatToken');
  } catch (error) {
    console.error('Fehler beim Löschen der Stream-Chat-Daten:', error);
  }
}