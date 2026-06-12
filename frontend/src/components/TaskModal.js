import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTaskStore from '../store/taskStore';
import useThemeStore from '../store/themeStore';

export default function TaskModal({ visible, onClose, initialData = null, type = 'small' }) {
  const { theme } = useThemeStore();
  const { createTask, updateTask } = useTaskStore();
  const [title, setTitle] = useState('');
  const [checklist, setChecklist] = useState([]);
  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setChecklist(initialData.checklist || []);
    } else {
      setTitle('');
      setChecklist([]);
    }
  }, [initialData, visible]);

  const handleSave = async () => {
    if (!title.trim()) return;

    const data = {
      title,
      // Pass checklist only on creation for now, updating checklist items is a bit more complex
      ...(initialData ? {} : { checklist: checklist.filter(item => item.content.trim()) })
    };

    if (initialData) {
      await updateTask(initialData.id, type, data);
    } else {
      await createTask(type, data);
    }
    
    onClose();
  };

  const addChecklistItem = () => {
    if (newItemText.trim()) {
      setChecklist([...checklist, { content: newItemText.trim(), is_completed: false }]);
      setNewItemText('');
    }
  };

  const removeChecklistItem = (index) => {
    setChecklist(checklist.filter((_, i) => i !== index));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View className="flex-1 justify-end bg-black/50" dataSet={{ theme }}>
        <View className="bg-base-100 h-[80%] rounded-t-3xl p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-base-content text-2xl font-bold">
              {initialData ? 'Edit Task' : `New ${type === 'daily' ? 'Routine' : type === 'small' ? 'Quick Note' : 'Project'}`}
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} className="text-base-content" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="text-base-content/70 font-semibold mb-2">Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="What do you need to do?"
              placeholderTextColor="#9ca3af"
              className="bg-base-200 text-base-content p-4 rounded-xl mb-6 border border-base-300"
            />

            {!initialData && (
              <View className="mb-6">
                <Text className="text-base-content/70 font-semibold mb-2">Checklist Items (Optional)</Text>
                
                {checklist.map((item, index) => (
                  <View key={index} className="flex-row items-center bg-base-200 p-3 rounded-xl mb-2 border border-base-300">
                    <Ionicons name="ellipse-outline" size={16} className="text-base-content/50 mr-2" />
                    <Text className="text-base-content flex-1">{item.content || item.title}</Text>
                    <TouchableOpacity onPress={() => removeChecklistItem(index)}>
                      <Ionicons name="trash-outline" size={20} className="text-error" />
                    </TouchableOpacity>
                  </View>
                ))}

                <View className="flex-row items-center mt-2">
                  <TextInput
                    value={newItemText}
                    onChangeText={setNewItemText}
                    placeholder="Add an item..."
                    placeholderTextColor="#9ca3af"
                    onSubmitEditing={addChecklistItem}
                    className="flex-1 bg-base-200 text-base-content p-3 rounded-l-xl border border-r-0 border-base-300"
                  />
                  <TouchableOpacity onPress={addChecklistItem} className="bg-primary p-3 rounded-r-xl justify-center border border-primary">
                    <Ionicons name="add" size={20} className="text-primary-content" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity 
              onPress={handleSave}
              className={`p-4 rounded-xl items-center mt-4 ${title.trim() ? 'bg-primary' : 'bg-base-300 opacity-50'}`}
              disabled={!title.trim()}
            >
              <Text className={`${title.trim() ? 'text-primary-content' : 'text-base-content/50'} font-bold text-lg`}>
                Save Task
              </Text>
            </TouchableOpacity>
            <View className="h-20" />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
