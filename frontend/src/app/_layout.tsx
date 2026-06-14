import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import useThemeStore from '../store/themeStore';
// @ts-ignore
import '../global.css';

export default function RootLayout() {
  const { theme } = useThemeStore();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return (
    // @ts-ignore
    <View className="flex-1" dataSet={{ theme }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}
