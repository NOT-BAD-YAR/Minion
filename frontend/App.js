import React, { useEffect } from 'react';
import './src/global.css';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import useThemeStore from './src/store/themeStore';
import { View, Platform } from 'react-native';

export default function App() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    if (Platform.OS === 'web') {
      document.documentElement.setAttribute('data-theme', theme);
      
      if (!document.getElementById('daisyui-css')) {
        const link = document.createElement('link');
        link.id = 'daisyui-css';
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/daisyui@4.11.1/dist/full.min.css';
        document.head.appendChild(link);
      }
    }
  }, [theme]);

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }} dataSet={{ theme }}>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}
