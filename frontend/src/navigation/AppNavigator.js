import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import LongTasksScreen from '../screens/LongTasksScreen';
import ThemePreviewScreen from '../screens/ThemePreviewScreen';

const Tab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View className="flex-row bg-base-200 h-20 items-center px-4 border-t border-base-300">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title !== undefined ? options.title : route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName = 'list';
        if (route.name === 'Dashboard') iconName = 'home';
        if (route.name === 'ThemePreview') iconName = 'color-palette';
        if (!isFocused) iconName += '-outline';

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            className="flex-1 items-center justify-center"
          >
            <Ionicons 
              name={iconName} 
              size={24} 
              color="currentColor" 
              className={isFocused ? "text-primary" : "text-base-content/50"} 
            />
            <Text className={`text-xs mt-1 ${isFocused ? "text-primary font-bold" : "text-base-content/50 font-medium"}`}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ title: 'Today' }}
      />
      <Tab.Screen 
        name="Projects" 
        component={LongTasksScreen} 
        options={{ title: 'Projects' }}
      />
      <Tab.Screen 
        name="ThemePreview" 
        component={ThemePreviewScreen} 
        options={{ title: 'Theme' }}
      />
    </Tab.Navigator>
  );
}
