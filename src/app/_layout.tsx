import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ProfileAvatar from '@/src/components/ProfileImage/ProfileAvatar';
import { Link } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import LottieView from 'lottie-react-native';
import { ChatProvider } from '@/src/components/provider/ChatProvider';
import { initializeSupabase } from '@/src/utils/supabaseclient';
import { AuthService } from '@/src/services/auth/AuthServices';

export {
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const [loaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeSupabase();
const authService = AuthService.getInstance();
const sessionRestored = await authService.restoreSession();
setIsAuthenticated(sessionRestored);
        
        if (loaded) {
          await SplashScreen.hideAsync();
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Fehler bei der Initialisierung:', err);
        setSupabaseError('Fehler beim Starten der App. Bitte versuchen Sie es später erneut.');
        setIsLoading(false);
      }
    };

    if (loaded) {
      initialize();
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

  if (supabaseError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{supabaseError}</Text>
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
        {isAuthenticated ? (
          <>
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
          </>
        ) : (
          <>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{  }} />
            <Stack.Screen name="(register)" options={{  }} />
          </>
        )}
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