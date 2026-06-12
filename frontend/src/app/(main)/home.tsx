import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchTasks } from '../../services/taskService';
import { useTaskStore } from '../../store/useTaskStore';
import { mockUser } from '../../services/mockData';
import { Task } from '../../types';

export default function HomeScreen() {
  const router = useRouter();
  const { tasks, setTasks } = useTaskStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks();
        setTasks(data);
      } catch (error) {
        console.error('Failed to load tasks', error);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  const renderTaskSection = (title: string, scope: 'Small' | 'Daily' | 'Long') => {
    const sectionTasks = tasks.filter(t => t.scope === scope);
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <TouchableOpacity>
             <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {sectionTasks.length === 0 ? (
           <Text style={styles.emptyText}>No tasks for now.</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {sectionTasks.map(task => (
              <TouchableOpacity 
                key={task.id} 
                style={styles.taskCard}
                activeOpacity={0.8}
                onPress={() => router.push(`/(main)/task/${task.id}`)}
              >
                <View style={styles.taskHeader}>
                  <Text style={styles.taskScope}>{task.scope}</Text>
                  <View style={[styles.statusIndicator, task.isCompleted && styles.statusCompleted]} />
                </View>
                <Text style={styles.taskTitle} numberOfLines={1}>{task.title}</Text>
                <Text style={styles.taskDesc} numberOfLines={2}>{task.description}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {mockUser.name}!</Text>
        <Text style={styles.subtitle}>Here is your progress today.</Text>
      </View>

      {renderTaskSection('Small Tasks', 'Small')}
      {renderTaskSection('Daily Objectives', 'Daily')}
      {renderTaskSection('Long-term Goals', 'Long')}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    paddingVertical: 24,
  },
  center: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  seeAll: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  emptyText: {
    color: '#64748b',
    paddingHorizontal: 24,
    fontStyle: 'italic',
  },
  scrollContent: {
    paddingHorizontal: 24,
    gap: 16,
  },
  taskCard: {
    width: 240,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskScope: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: 'bold',
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ef4444', // red
  },
  statusCompleted: {
    backgroundColor: '#22c55e', // green
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  taskDesc: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
});
