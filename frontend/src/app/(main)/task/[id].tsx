import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTaskStore } from '../../../store/useTaskStore';
import { updateTask } from '../../../services/taskService';
import { Task } from '../../../types';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { tasks, setTasks } = useTaskStore();
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const foundTask = tasks.find(t => t.id === id);
    if (foundTask) {
      setTask(foundTask);
    }
  }, [id, tasks]);

  const toggleStatus = async () => {
    if (!task) return;
    setLoading(true);
    try {
      const updated = await updateTask(task.id, { isCompleted: !task.isCompleted });
      setTask(updated);
      // Update store
      const newTasks = tasks.map(t => t.id === updated.id ? updated : t);
      setTasks(newTasks);
    } catch (error) {
      console.error('Failed to update task status', error);
    } finally {
      setLoading(false);
    }
  };

  if (!task) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Task not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
           <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
         <TouchableOpacity onPress={() => router.back()} style={styles.backButtonTop}>
           <Text style={styles.backButtonTextTop}>← Back</Text>
         </TouchableOpacity>
         <Text style={styles.scopeBadge}>{task.scope}</Text>
      </View>

      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.description}>{task.description}</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status:</Text>
        <Text style={[styles.statusValue, task.isCompleted ? styles.completedText : styles.pendingText]}>
          {task.isCompleted ? 'Completed' : 'Pending'}
        </Text>
      </View>

      <TouchableOpacity 
        style={[styles.toggleButton, task.isCompleted ? styles.toggleButtonComplete : styles.toggleButtonPending]} 
        onPress={toggleStatus}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.toggleButtonText}>
            {task.isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 24,
  },
  center: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButtonTop: {
    padding: 8,
  },
  backButtonTextTop: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scopeBadge: {
    backgroundColor: '#1e3a8a',
    color: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  description: {
    fontSize: 18,
    color: '#94a3b8',
    lineHeight: 28,
    marginBottom: 32,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statusLabel: {
    fontSize: 16,
    color: '#e2e8f0',
    marginRight: 8,
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  completedText: {
    color: '#22c55e',
  },
  pendingText: {
    color: '#ef4444',
  },
  toggleButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  toggleButtonPending: {
    backgroundColor: '#3b82f6',
  },
  toggleButtonComplete: {
    backgroundColor: '#64748b',
  },
  toggleButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  backButton: {
    padding: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
