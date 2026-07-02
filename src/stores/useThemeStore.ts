import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  accentColor: string | null;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setAccent: (accent: string | null) => void;
  /** Syncs the current theme to the <html> element class + color-scheme. */
  applyTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      accentColor: null,

      toggleTheme: () => {
        const next: Theme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: next });
        get().applyTheme();
      },

      setTheme: (theme) => {
        set({ theme });
        get().applyTheme();
      },

      setAccent: (accentColor) => set({ accentColor }),

      applyTheme: () => {
        const root = document.documentElement;
        root.classList.toggle('dark', get().theme === 'dark');
      },
    }),
    {
      name: 'recipehub-theme',
      onRehydrateStorage: () => (state) => {
        state?.applyTheme();
      },
    },
  ),
);
