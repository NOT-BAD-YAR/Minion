import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#0f172a', // bg-background
        },
        headerTintColor: '#f8fafc', // text-white
        tabBarStyle: {
          backgroundColor: '#1e293b', // bg-surface
          borderTopColor: '#334155',
        },
        tabBarActiveTintColor: '#6366f1', // primary
        tabBarInactiveTintColor: '#94a3b8', // subtext
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="theme"
        options={{
          title: 'Theme',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="color-palette" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
