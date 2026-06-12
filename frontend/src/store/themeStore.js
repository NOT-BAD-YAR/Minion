import { create } from 'zustand';

const useThemeStore = create((set) => ({
  theme: 'dark', // default theme
  setTheme: (newTheme) => set({ theme: newTheme }),
}));

export default useThemeStore;
