import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../store/themeStore';

const THEMES = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
  "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden",
  "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black",
  "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade",
  "night", "coffee", "winter", "dim", "nord", "sunset"
];

export default function ThemePreviewScreen() {
  const { theme, setTheme } = useThemeStore();
  const [themeModalVisible, setThemeModalVisible] = useState(false);

  return (
    <View className="flex-1 bg-base-100">
      {/* Header */}
      <View className="px-6 pt-6 pb-4 border-b border-base-300">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-base-content/60 text-sm font-medium tracking-wider uppercase mb-1">Global Configuration</Text>
            <Text className="text-base-content text-3xl font-bold tracking-tight">Theme Preview</Text>
          </View>
          <TouchableOpacity 
            onPress={() => setThemeModalVisible(true)}
            className="w-12 h-12 bg-base-200 rounded-full items-center justify-center border border-base-300 shadow-sm"
          >
            <Ionicons name="color-palette-outline" size={24} color="currentColor" className="text-base-content" />
          </TouchableOpacity>
        </View>
        <Text className="text-base-content/70 mt-2">Current Theme: <Text className="font-bold capitalize text-primary">{theme}</Text></Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        
        {/* Colors Section */}
        <Text className="text-xl font-bold text-base-content mb-4">Brand Colors</Text>
        <View className="flex-row flex-wrap gap-3 mb-8">
          <View className="bg-primary p-4 rounded-xl flex-1 min-w-[45%] items-center justify-center">
            <Text className="text-primary-content font-bold">Primary</Text>
          </View>
          <View className="bg-secondary p-4 rounded-xl flex-1 min-w-[45%] items-center justify-center">
            <Text className="text-secondary-content font-bold">Secondary</Text>
          </View>
          <View className="bg-accent p-4 rounded-xl flex-1 min-w-[45%] items-center justify-center">
            <Text className="text-accent-content font-bold">Accent</Text>
          </View>
          <View className="bg-neutral p-4 rounded-xl flex-1 min-w-[45%] items-center justify-center">
            <Text className="text-neutral-content font-bold">Neutral</Text>
          </View>
        </View>

        {/* Buttons Section */}
        <Text className="text-xl font-bold text-base-content mb-4">Buttons</Text>
        <View className="flex-row flex-wrap gap-2 mb-8">
          <TouchableOpacity className="btn btn-primary"><Text className="text-primary-content font-semibold">Primary</Text></TouchableOpacity>
          <TouchableOpacity className="btn btn-secondary"><Text className="text-secondary-content font-semibold">Secondary</Text></TouchableOpacity>
          <TouchableOpacity className="btn btn-accent"><Text className="text-accent-content font-semibold">Accent</Text></TouchableOpacity>
          <TouchableOpacity className="btn btn-ghost"><Text className="text-base-content font-semibold">Ghost</Text></TouchableOpacity>
          <TouchableOpacity className="btn btn-link"><Text className="text-primary font-semibold underline">Link</Text></TouchableOpacity>
          <TouchableOpacity className="btn btn-outline btn-primary"><Text className="text-primary font-semibold">Outline</Text></TouchableOpacity>
        </View>

        {/* Badges Section */}
        <Text className="text-xl font-bold text-base-content mb-4">Badges</Text>
        <View className="flex-row flex-wrap gap-2 mb-8">
          <View className="badge badge-primary"><Text className="text-primary-content text-xs">Primary</Text></View>
          <View className="badge badge-secondary"><Text className="text-secondary-content text-xs">Secondary</Text></View>
          <View className="badge badge-accent"><Text className="text-accent-content text-xs">Accent</Text></View>
          <View className="badge badge-outline"><Text className="text-base-content text-xs">Outline</Text></View>
        </View>

        {/* Cards Section */}
        <Text className="text-xl font-bold text-base-content mb-4">Cards & Surfaces</Text>
        <View className="card bg-base-200 shadow-xl mb-4 border border-base-300">
          <View className="card-body p-6">
            <Text className="card-title text-base-content font-bold text-lg mb-2">Base 200 Card</Text>
            <Text className="text-base-content/80 mb-4">This is a standard card using base-200 background. Great for highlighting content sections.</Text>
            <View className="card-actions justify-end">
              <TouchableOpacity className="btn btn-primary btn-sm"><Text className="text-primary-content font-semibold">Action</Text></TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <Text className="text-xl font-bold text-base-content mb-4">Stats & Metrics</Text>
        <View className="stats shadow bg-base-200 border border-base-300 mb-8 w-full flex-row rounded-2xl overflow-hidden">
          <View className="stat flex-1 border-r border-base-300 p-4">
            <Text className="stat-title text-base-content/70 text-xs">Total Tasks</Text>
            <Text className="stat-value text-primary text-2xl font-bold">25.6K</Text>
            <Text className="stat-desc text-base-content/60 text-xs">21% more than last month</Text>
          </View>
          <View className="stat flex-1 p-4">
            <Text className="stat-title text-base-content/70 text-xs">Completed</Text>
            <Text className="stat-value text-secondary text-2xl font-bold">89%</Text>
            <Text className="stat-desc text-base-content/60 text-xs">Great progress</Text>
          </View>
        </View>

        {/* Alerts Section */}
        <Text className="text-xl font-bold text-base-content mb-4">Feedback Alerts</Text>
        <View className="gap-3 mb-8">
          <View className="alert alert-info rounded-xl p-4 flex-row items-center">
            <Ionicons name="information-circle" size={20} className="text-info-content mr-2" />
            <Text className="text-info-content font-medium flex-1">New software update available.</Text>
          </View>
          <View className="alert alert-success rounded-xl p-4 flex-row items-center">
            <Ionicons name="checkmark-circle" size={20} className="text-success-content mr-2" />
            <Text className="text-success-content font-medium flex-1">Task completed successfully!</Text>
          </View>
          <View className="alert alert-warning rounded-xl p-4 flex-row items-center">
            <Ionicons name="warning" size={20} className="text-warning-content mr-2" />
            <Text className="text-warning-content font-medium flex-1">Warning: Invalid email address!</Text>
          </View>
          <View className="alert alert-error rounded-xl p-4 flex-row items-center">
            <Ionicons name="close-circle" size={20} className="text-error-content mr-2" />
            <Text className="text-error-content font-medium flex-1">Error! Task deletion failed.</Text>
          </View>
        </View>

        <View className="h-10" />
      </ScrollView>

      {/* Theme Picker Modal */}
      <Modal visible={themeModalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-end bg-black/50" dataSet={{ theme }}>
          <View className="bg-base-100 h-2/3 rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-base-content text-2xl font-bold">Select Theme</Text>
              <TouchableOpacity onPress={() => setThemeModalVisible(false)} className="p-2">
                <Ionicons name="close" size={24} className="text-base-content" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={THEMES}
              keyExtractor={item => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={() => { setTheme(item); setThemeModalVisible(false); }}
                  className={`p-4 rounded-xl mb-3 border ${theme === item ? 'border-primary shadow-sm' : 'border-base-300'} bg-base-200`}
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className={`text-lg capitalize font-bold text-base-content`}>
                      {item}
                    </Text>
                    {theme === item && <Ionicons name="checkmark-circle" size={20} className="text-primary" />}
                  </View>
                  
                  {/* Theme Preview Colors */}
                  <View className="flex-row gap-2" dataSet={{ theme: item }}>
                    <View className="w-8 h-8 rounded bg-primary border border-base-content/10 items-center justify-center">
                      <Text className="text-[8px] text-primary-content">P</Text>
                    </View>
                    <View className="w-8 h-8 rounded bg-secondary border border-base-content/10 items-center justify-center">
                      <Text className="text-[8px] text-secondary-content">S</Text>
                    </View>
                    <View className="w-8 h-8 rounded bg-accent border border-base-content/10 items-center justify-center">
                      <Text className="text-[8px] text-accent-content">A</Text>
                    </View>
                    <View className="w-8 h-8 rounded bg-neutral border border-base-content/10 items-center justify-center">
                      <Text className="text-[8px] text-neutral-content">N</Text>
                    </View>
                    <View className="flex-1 bg-base-100 rounded border border-base-content/10 px-2 justify-center">
                      <Text className="text-[10px] text-base-content">Base</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
