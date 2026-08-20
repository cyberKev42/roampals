import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../../global.css';
import * as SecureStore from 'expo-secure-store';
import { AuthProvider, useAuth } from '../context/auth-context';
import { useColorScheme } from 'react-native';
import React, { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootNavigator() {

  console.log("🔥 APP STARTED");

  SecureStore.getItemAsync('jwt').then((token) => {
      console.log("JWT Token:", token);
    if (token) {
      console.log("User is logged in");
    } else {
      console.log("User is NOT logged in");
    }
  });

  const { userAuthState, isLoading } = useAuth();
  // Hold rendering until SecureStore check is complete
  if (isLoading) return null;

  return (
    <Stack>
      {/* Shown only when user is NOT logged in */}
      <Stack.Protected guard={!userAuthState}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* Shown only when user IS logged in but hasn't completed onboarding */}
      <Stack.Protected guard={!!userAuthState && !userAuthState.avatar}>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* Shown only when user IS logged in and has completed onboarding */}
      <Stack.Protected guard={!!userAuthState && !!userAuthState.avatar}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} /> */}

    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    'Allura-Regular': require('../styles/fonts/Allura/Allura-Regular.ttf'),
    'Bungee-Regular': require('../styles/fonts/Bungee/Bungee-Regular.ttf'),
    'Dangrek-Regular': require('../styles/fonts/Dangrek/Dangrek-Regular.ttf'),
    'LilitaOne-Regular': require('../styles/fonts/Lilita_One/LilitaOne-Regular.ttf'),
    'LobsterTwo-Regular': require('../styles/fonts/Lobster_Two/LobsterTwo-Regular.ttf'),
    'LobsterTwo-Bold': require('../styles/fonts/Lobster_Two/LobsterTwo-Bold.ttf'),
    'LobsterTwo-Italic': require('../styles/fonts/Lobster_Two/LobsterTwo-Italic.ttf'),
    'LobsterTwo-BoldItalic': require('../styles/fonts/Lobster_Two/LobsterTwo-BoldItalic.ttf'),
    'MonomaniacOne-Regular': require('../styles/fonts/Monomaniac_One/MonomaniacOne-Regular.ttf'),
    'Monoton-Regular': require('../styles/fonts/Monoton/Monoton-Regular.ttf'),
    'PlaywriteID-Regular': require('../styles/fonts/Playwrite_ID/static/PlaywriteID-Regular.ttf'),
    'PlaywriteNZ-Regular': require('../styles/fonts/Playwrite_NZ/static/PlaywriteNZ-Regular.ttf'),
    'Shrikhand-Regular': require('../styles/fonts/Shrikhand/Shrikhand-Regular.ttf'),
    'Fredoka-Regular': require('../styles/fonts/Fredoka/Fredoka-Regular.ttf'),
    'Fredoka-Medium': require('../styles/fonts/Fredoka/Fredoka-Medium.ttf'),
    'Fredoka-SemiBold': require('../styles/fonts/Fredoka/Fredoka-SemiBold.ttf'),
    'Fredoka-Bold': require('../styles/fonts/Fredoka/Fredoka-Bold.ttf'),
    'Nunito-Regular': require('../styles/fonts/Nunito/Nunito-Regular.ttf'),
    'Nunito-Bold': require('../styles/fonts/Nunito/Nunito-Bold.ttf'),
    'Baloo2-Regular': require('../styles/fonts/Baloo_2/Baloo2-Regular.ttf'),
    'Baloo2-Bold': require('../styles/fonts/Baloo_2/Baloo2-Bold.ttf'),
    'Quicksand-Regular': require('../styles/fonts/Quicksand/Quicksand-Regular.ttf'),
    'Quicksand-Bold': require('../styles/fonts/Quicksand/Quicksand-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <RootNavigator />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
