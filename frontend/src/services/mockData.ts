import { Task } from '../types';

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Buy groceries',
    description: 'Milk, Eggs, Bread, and Coffee',
    scope: 'Small',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Workout',
    description: '1 hour of weightlifting',
    scope: 'Daily',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Read a book',
    description: 'Read 20 pages of a self-improvement book',
    scope: 'Daily',
    isCompleted: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Learn React Native',
    description: 'Complete the Expo Router tutorial',
    scope: 'Long',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Build Minion App',
    description: 'Finish the frontend UI',
    scope: 'Long',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
];

export const mockUser = {
  id: 'user_1',
  name: 'Kavin',
  email: 'kavin@example.com',
};
