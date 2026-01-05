import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
         <Stack.Screen name="(login)/index" options={{ headerShown: false }} />
         <Stack.Screen name="(register)/index" options={{ headerShown: false }} />
         <Stack.Screen name="(sell vehicle)/index" options={{ headerShown: false }} />
         <Stack.Screen name="(service)/index" options={{ headerShown: false }} />
         <Stack.Screen name="(user dashboard)/index" options={{ headerShown: false }} />
         <Stack.Screen name="(vehicle score)/index" options={{ headerShown: false }} />
         <Stack.Screen name="(price predict)/index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
