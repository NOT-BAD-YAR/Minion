import api from './api';
import { Task } from '../types';
import { mockTasks } from './mockData';

const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true';

// Simulate network delay for mock mode
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchTasks = async (): Promise<Task[]> => {
  if (USE_MOCK) {
    await delay(500);
    return [...mockTasks];
  }
  const response = await api.get('/tasks');
  return response.data;
};

export const createTask = async (task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
  if (USE_MOCK) {
    await delay(500);
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
    };
    return newTask;
  }
  const response = await api.post('/tasks', task);
  return response.data;
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  if (USE_MOCK) {
    await delay(500);
    const taskIndex = mockTasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
       mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...updates };
       return mockTasks[taskIndex];
    }
    throw new Error('Task not found');
  }
  const response = await api.put(`/tasks/${id}`, updates);
  return response.data;
};
