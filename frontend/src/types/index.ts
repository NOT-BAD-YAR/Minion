export interface Task {
  id: string;
  title: string;
  description: string;
  scope: 'Small' | 'Daily' | 'Long';
  isCompleted: boolean;
  createdAt: string;
}
