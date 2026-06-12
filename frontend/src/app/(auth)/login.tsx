import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function LoginScreen() {
  const router = useRouter();

  const handleLogin = () => {
    // For now, just navigate to main app
    router.replace('/(main)');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center px-6">
        <View className="mb-10">
          <Text className="text-4xl font-bold text-white text-center">Minion</Text>
          <Text className="text-subtext text-center mt-2 text-lg">Your smart task assistant</Text>
        </View>

        <Input label="Email" placeholder="Enter your email" keyboardType="email-address" />
        <Input label="Password" placeholder="Enter your password" secureTextEntry />

        <Button title="Login" onPress={handleLogin} className="mt-4" />
        
        <View className="flex-row justify-center mt-6">
          <Text className="text-subtext">Don't have an account? </Text>
          <Text className="text-primary font-bold">Sign Up</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
