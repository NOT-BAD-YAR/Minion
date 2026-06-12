import { create } from 'zustand';
import api from '../services/api';

const useTaskStore = create((set, get) => ({
  smallTasks: [],
  dailyTasks: [],
  longTasks: [],
  isLoading: false,
  error: null,

  fetchTodayTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const [smallRes, dailyRes] = await Promise.all([
        api.get('/small'),
        api.get('/daily')
      ]);
      
      const extract = (res) => {
        if (!res) return [];
        if (Array.isArray(res)) return res;
        if (Array.isArray(res.data)) return res.data;
        if (res.data && Array.isArray(res.data.data)) return res.data.data;
        if (typeof res === 'object' && res !== null) {
          // find any array value in the object
          for (const key in res) {
            if (Array.isArray(res[key])) return res[key];
          }
        }
        return [];
      };

      set({ 
        smallTasks: extract(smallRes), 
        dailyTasks: extract(dailyRes), 
        isLoading: false 
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchLongTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/long');
      const extract = (r) => {
        if (!r) return [];
        if (Array.isArray(r)) return r;
        if (Array.isArray(r.data)) return r.data;
        if (r.data && Array.isArray(r.data.data)) return r.data.data;
        if (typeof r === 'object' && r !== null) {
          for (const key in r) {
            if (Array.isArray(r[key])) return r[key];
          }
        }
        return [];
      };
      set({ longTasks: extract(res), isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  toggleChecklistItem: async (itemId) => {
    try {
      // Optimistically update the UI by mapping over tasks and their checklists
      const updateChecklist = (tasks) => tasks.map(task => {
        if (!task.checklist) return task;
        return {
          ...task,
          checklist: task.checklist.map(item => 
            item.id === itemId ? { ...item, is_completed: !item.is_completed } : item
          )
        };
      });

      set({
        smallTasks: updateChecklist(get().smallTasks),
        dailyTasks: updateChecklist(get().dailyTasks),
        longTasks: updateChecklist(get().longTasks),
      });

      // Update backend
      await api.put(`/checklist/${itemId}`);
      // Also fetch progress after checking off an item
      get().fetchProgress();
    } catch (error) {
      // Revert optimism by fetching again if it fails
      get().fetchTodayTasks();
      get().fetchLongTasks();
      console.error('Failed to toggle checklist item', error);
    }
  },

  toggleTaskCompletion: async (taskId, type) => {
    try {
      // Find current task
      let taskList;
      if (type === 'small') taskList = get().smallTasks;
      else if (type === 'daily') taskList = get().dailyTasks;
      else if (type === 'long') taskList = get().longTasks;

      const task = taskList.find(t => t.id === taskId);
      if (!task) return;

      const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';

      // Update backend
      await api.put(`/${type}/${taskId}`, { status: newStatus });
      
      // Re-fetch today's tasks so it accurately pulls from the updated DB
      if (type === 'long') get().fetchLongTasks();
      else get().fetchTodayTasks();

    } catch (error) {
      console.error('Failed to toggle task completion', error);
    }
  },

  createTask: async (type, data) => {
    try {
      await api.post(`/${type}`, data);
      if (type === 'long') {
        get().fetchLongTasks();
      } else {
        get().fetchTodayTasks();
      }
    } catch (error) {
      console.error('Failed to create task', error);
    }
  },

  updateTask: async (id, type, data) => {
    try {
      await api.put(`/${type}/${id}`, data);
      if (type === 'long') {
        get().fetchLongTasks();
      } else {
        get().fetchTodayTasks();
      }
    } catch (error) {
      console.error('Failed to update task', error);
    }
  },

  deleteTask: async (id, type) => {
    try {
      // Optimistic delete
      if (type === 'small') {
        set({ smallTasks: get().smallTasks.filter(t => t.id !== id) });
      } else if (type === 'daily') {
        set({ dailyTasks: get().dailyTasks.filter(t => t.id !== id) });
      } else if (type === 'long') {
        set({ longTasks: get().longTasks.filter(t => t.id !== id) });
      }

      await api.delete(`/${type}/${id}`);
      get().fetchProgress(); // Progress might change if a daily task is deleted
    } catch (error) {
      console.error('Failed to delete task', error);
      get().fetchTodayTasks();
      get().fetchLongTasks();
    }
  },

  progressHistory: [],
  fetchProgress: async () => {
    try {
      const res = await api.get('/progress');
      set({ progressHistory: (Array.isArray(res) ? res : res?.data) || [] });
    } catch (error) {
      console.error('Failed to fetch progress', error);
    }
  }
}));

export default useTaskStore;
