import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTaskStore from '../store/taskStore';
import useThemeStore from '../store/themeStore';
import TaskModal from '../components/TaskModal';

export default function LongTasksScreen() {
  const { longTasks, fetchLongTasks, toggleChecklistItem, deleteTask, isLoading } = useTaskStore();
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchLongTasks();
  }, []);


  const openNewTaskModal = () => {
    setEditingTask(null);
    setTaskModalVisible(true);
  };

  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setTaskModalVisible(true);
  };

  const confirmDelete = (id) => {
    deleteTask(id, 'long');
  };

  return (
    <View className="flex-1 bg-base-100 px-6 pt-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6 mt-2">
        <View>
          <Text className="text-base-content/60 text-sm font-medium tracking-wider uppercase mb-1">Projects</Text>
          <Text className="text-base-content text-3xl font-bold tracking-tight">Long Tasks</Text>
        </View>
        <TouchableOpacity onPress={fetchLongTasks} className="p-2">
          <Ionicons name="refresh" size={24} color="currentColor" className="text-base-content" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {isLoading && <Text className="text-base-content/50 text-center py-4">Loading projects...</Text>}
        {!isLoading && (!longTasks || longTasks.length === 0) && <Text className="text-base-content/50 text-center py-4">No long tasks found.</Text>}
        
        {!isLoading && (longTasks || []).map((task) => (
          <View key={task.id} className="bg-base-200 p-5 rounded-2xl mb-4 border border-base-300">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold text-base-content flex-1">{task.title}</Text>
              <View className="flex-row">
                <TouchableOpacity onPress={() => openEditTaskModal(task)} className="p-2">
                  <Ionicons name="pencil-outline" size={18} className="text-base-content/50" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDelete(task.id)} className="p-2">
                  <Ionicons name="trash-outline" size={18} className="text-error/70" />
                </TouchableOpacity>
              </View>
            </View>
            {task.checklist?.map(item => (
              <TouchableOpacity 
                key={item.id} 
                onPress={() => toggleChecklistItem(item.id)}
                className="flex-row items-center py-2"
                activeOpacity={0.7}
              >
                <View className={`w-5 h-5 rounded items-center justify-center mr-3 border ${item.is_completed ? 'bg-primary border-primary' : 'border-base-content/30 bg-transparent'}`}>
                  {item.is_completed && <Ionicons name="checkmark" size={14} color="currentColor" className="text-primary-content" />}
                </View>
                <Text className={`text-sm flex-1 ${item.is_completed ? 'text-base-content/40 line-through' : 'text-base-content'}`}>
                  {item.content || item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <View className="h-24" />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        onPress={openNewTaskModal}
        className="absolute bottom-6 right-6 w-16 h-16 bg-primary rounded-full items-center justify-center shadow-lg shadow-primary/50"
      >
        <Ionicons name="add" size={32} color="currentColor" className="text-primary-content" />
      </TouchableOpacity>

      <TaskModal 
        visible={taskModalVisible} 
        onClose={() => setTaskModalVisible(false)} 
        initialData={editingTask} 
        type="long" 
      />
    </View>
  );
}
