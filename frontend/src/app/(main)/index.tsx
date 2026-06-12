import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { Button } from '../../components/ui/Button';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-3xl font-bold text-white mb-4">Welcome to Minion</Text>
        <Text className="text-subtext mb-8 text-center">
          This is the main dashboard where tasks will be displayed.
        </Text>
        
        <Button title="Logout" variant="outline" onPress={handleLogout} className="w-full" />
      </View>
    </SafeAreaView>
  );
}
