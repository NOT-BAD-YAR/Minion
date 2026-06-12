import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTaskStore from '../store/taskStore';
import useThemeStore from '../store/themeStore';
import TaskModal from '../components/TaskModal';
import StreakGraph from '../components/StreakGraph';

const THEMES = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
  "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden",
  "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black",
  "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade",
  "night", "coffee", "winter", "dim", "nord", "sunset"
];

export default function DashboardScreen() {
  const { smallTasks, dailyTasks, progressHistory, fetchTodayTasks, fetchProgress, toggleChecklistItem, deleteTask, isLoading } = useTaskStore();
  const { theme, setTheme } = useThemeStore();
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskType, setTaskType] = useState('small');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [itemToToggle, setItemToToggle] = useState(null);

  useEffect(() => {
    fetchTodayTasks();
    fetchProgress();
  }, []);


  const openNewTaskModal = (type) => {
    setTaskType(type);
    setEditingTask(null);
    setTaskModalVisible(true);
  };

  const openEditTaskModal = (task, type) => {
    setTaskType(type);
    setEditingTask(task);
    setTaskModalVisible(true);
  };

  const requestToggle = (item) => {
    setItemToToggle(item);
    setConfirmModalVisible(true);
  };

  const executeToggle = () => {
    if (itemToToggle) {
      toggleChecklistItem(itemToToggle.id);
    }
    setConfirmModalVisible(false);
    setItemToToggle(null);
  };

  const confirmDelete = (id, type) => {
    // Delete without confirm on web for now, as Alert.alert doesn't always show up well
    deleteTask(id, type);
  };

  const todayProgress = progressHistory && progressHistory.length > 0 ? progressHistory[0].completion_percentage : 0;

  return (
    <View className="flex-1 bg-base-100 px-6 pt-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6 mt-2">
        <View>
          <Text className="text-base-content/60 text-sm font-medium tracking-wider uppercase mb-1">Good Morning</Text>
          <Text className="text-base-content text-3xl font-bold tracking-tight">Kavin</Text>
        </View>
        <TouchableOpacity 
          onPress={() => setThemeModalVisible(true)}
          className="w-12 h-12 bg-base-200 rounded-full items-center justify-center border border-base-300 shadow-sm"
        >
          <Ionicons name="color-palette-outline" size={24} color="currentColor" className="text-base-content" />
        </TouchableOpacity>
      </View>

      {/* Stats Summary */}
      <View className="flex-row gap-4 mb-6">
        <View className="flex-1 bg-primary/20 rounded-2xl p-5 border border-primary/30">
          <Text className="text-primary text-3xl font-bold mb-1">{todayProgress}%</Text>
          <Text className="text-primary/80 text-xs font-medium uppercase tracking-wider">Today's Routine</Text>
        </View>
        <View className="flex-1 bg-base-200 rounded-2xl p-5 border border-base-300">
          <Text className="text-base-content text-3xl font-bold mb-1">{(smallTasks || []).length}</Text>
          <Text className="text-base-content/60 text-xs font-medium uppercase tracking-wider">Quick Notes</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        
        {/* Quick Notes Section */}
        <View className="flex-row justify-between items-end mb-4">
          <Text className="text-base-content text-xl font-bold">Quick Notes</Text>
          <TouchableOpacity onPress={() => openNewTaskModal('small')}>
            <Text className="text-primary text-sm font-semibold">+ Add Note</Text>
          </TouchableOpacity>
        </View>
        
        {(!smallTasks || smallTasks.length === 0) && !isLoading && (
          <Text className="text-base-content/40 mb-6 italic">No quick notes yet.</Text>
        )}

        {(smallTasks || []).map((task) => (
          <TouchableOpacity 
            key={task.id} 
            onLongPress={() => openEditTaskModal(task, 'small')}
            delayLongPress={200}
            className="bg-base-200 p-4 rounded-xl mb-3 border border-base-300 flex-row justify-between items-center"
          >
            <TouchableOpacity 
              onPress={() => useTaskStore.getState().toggleTaskCompletion(task.id, 'small')}
              className="mr-3"
            >
              <View className={`w-6 h-6 rounded-full items-center justify-center border ${task.status === 'COMPLETED' ? 'bg-primary border-primary' : 'border-base-content/40 bg-transparent'}`}>
                {task.status === 'COMPLETED' && <Ionicons name="checkmark" size={16} color="currentColor" className="text-primary-content" />}
              </View>
            </TouchableOpacity>
            
            <Text className={`text-base font-semibold flex-1 ${task.status === 'COMPLETED' ? 'text-base-content/40 line-through' : 'text-base-content'}`}>
              {task.title}
            </Text>
            
            <TouchableOpacity onPress={() => confirmDelete(task.id, 'small')} className="p-2 ml-2">
              <Ionicons name="trash-outline" size={20} className="text-error/70" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {/* Daily Routines Section */}
        <View className="flex-row justify-between items-end mt-4 mb-4">
          <Text className="text-base-content text-xl font-bold">Daily Routines</Text>
          <TouchableOpacity onPress={() => openNewTaskModal('daily')}>
            <Text className="text-primary text-sm font-semibold">+ Add Routine</Text>
          </TouchableOpacity>
        </View>

        {(!dailyTasks || dailyTasks.length === 0) && !isLoading && (
          <Text className="text-base-content/40 mb-6 italic">No routines set up.</Text>
        )}

        {(dailyTasks || []).map((task) => (
          <View key={task.id} className="bg-base-200 p-4 rounded-xl mb-3 border border-base-300">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-base font-bold text-base-content">{task.title}</Text>
              <View className="flex-row">
                <TouchableOpacity onPress={() => openEditTaskModal(task, 'daily')} className="p-2">
                  <Ionicons name="pencil-outline" size={18} className="text-base-content/50" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDelete(task.id, 'daily')} className="p-2">
                  <Ionicons name="trash-outline" size={18} className="text-error/70" />
                </TouchableOpacity>
              </View>
            </View>
            
            {task.checklist?.map(item => (
              <TouchableOpacity 
                key={item.id} 
                onPress={() => requestToggle(item)}
                className="flex-row items-center py-2"
                activeOpacity={0.7}
              >
                <View className={`w-5 h-5 rounded items-center justify-center mr-3 border ${item.is_completed ? 'bg-primary border-primary' : 'border-base-content/30 bg-transparent'}`}>
                  {item.is_completed && <Ionicons name="checkmark" size={14} color="currentColor" className="text-primary-content" />}
                </View>
                <Text className={`text-sm ${item.is_completed ? 'text-base-content/40 line-through' : 'text-base-content'}`}>
                  {item.content || item.title}
                </Text>
              </TouchableOpacity>
            ))}
            
            <StreakGraph taskId={task.id} />
          </View>
        ))}

        <View className="h-24" />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        onPress={() => openNewTaskModal('small')}
        className="absolute bottom-6 right-6 w-16 h-16 bg-primary rounded-full items-center justify-center shadow-lg shadow-primary/50"
      >
        <Ionicons name="add" size={32} color="currentColor" className="text-primary-content" />
      </TouchableOpacity>

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

      {/* Task Creation Modal */}
      <TaskModal 
        visible={taskModalVisible} 
        onClose={() => setTaskModalVisible(false)} 
        initialData={editingTask} 
        type={taskType} 
      />

      {/* Confirmation Modal */}
      <Modal visible={confirmModalVisible} animationType="fade" transparent={true}>
        <View className="flex-1 justify-center items-center bg-black/50 px-6" dataSet={{ theme }}>
          <View className="bg-base-100 rounded-2xl p-6 w-full max-w-sm">
            <Text className="text-xl font-bold text-base-content mb-4">Confirm Action</Text>
            <Text className="text-base-content/70 mb-6">
              {itemToToggle?.is_completed 
                ? "Mark this task as incomplete?" 
                : "Mark this task as finished for today?"}
            </Text>
            <View className="flex-row justify-end space-x-3 gap-3">
              <TouchableOpacity 
                onPress={() => setConfirmModalVisible(false)}
                className="px-4 py-2 rounded-lg"
              >
                <Text className="text-base-content/70 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={executeToggle}
                className="bg-primary px-4 py-2 rounded-lg"
              >
                <Text className="text-primary-content font-bold">Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
