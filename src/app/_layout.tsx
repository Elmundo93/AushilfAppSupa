import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ProfileAvatar from '@/src/components/ProfileImage/ProfileAvatar';
import { Link } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import LottieView from 'lottie-react-native';
import { ChatProvider } from '@/src/components/provider/ChatProvider';


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const [loaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const [isLoading, setIsLoading] = useState(true);

  // ... vorhandener Code ...

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      setIsLoading(false);
    }
  }, [loaded]);



  if (!loaded || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LottieView
          source={require('../../assets/animations/LoadingWarp.json')}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack 
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTintColor: 'black',
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{  }} />
        <Stack.Screen name="(register)" options={{  }} />
        <Stack.Screen
          name="(authenticated)"
          options={{
            headerLeft: () => (
              <ProfileAvatar
                style={{ width: 40, height: 40, borderRadius: 40 }}
              />
            ),
            headerRight: () => (
              <Link href="/(modal)/einstellungen" asChild>
                <TouchableOpacity>
                  <Ionicons name="settings-outline" size={40} color="black" />
                </TouchableOpacity>
              </Link>
            ),
            headerTitle: () => (
              <Image
                source={require('@/assets/images/bienenlogo.png')}
                style={{ width: 50, height: 50, resizeMode: 'contain' }}
              />
            ),
          }}
        />
        
        <Stack.Screen name="(modal)/createPost" options={{ title: 'Beitrag verfassen', presentation: 'modal' }} />
        <Stack.Screen name="(modal)/postDetail/[postID]" options={{ title: 'Post Details', presentation: 'modal' }} />
        <Stack.Screen name="(modal)/einstellungen" options={{ title: 'Einstellungen', presentation: 'modal' }} />
        <Stack.Screen name="(modal)/profile/[userid]" options={{ title: 'Profil', presentation: 'modal' }} />
      </Stack>
    </>
  );
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ChatProvider>
   <MenuProvider>
    
      <InitialLayout />
   
  </MenuProvider>
  </ChatProvider>
  </GestureHandlerRootView>
  );
}