import '../global.css';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts as useSoraFonts,
  Sora_600SemiBold,
  Sora_700Bold,
} from '@expo-google-fonts/sora';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { JetBrainsMono_400Regular, JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { useAppReadinessStore } from '@/store/appReadinessStore';
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync().catch(() => {
  // Splash module may already be hidden in some dev environments; safe to ignore.
});

function RootNavigator() {
  const { resolvedScheme } = useTheme();

  return (
    <>
      <StatusBar style={resolvedScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="lesson/[id]"
          options={{ presentation: 'card', animation: 'slide_from_right' }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useSoraFonts({
    Sora_600SemiBold,
    Sora_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
  });
  const setFontsLoaded = useAppReadinessStore((s) => s.setFontsLoaded);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      setFontsLoaded(true);
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError, setFontsLoaded]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary fallbackTitle="Indent hit a snag.">
          <ThemeProvider>
            <RootNavigator />
          </ThemeProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
