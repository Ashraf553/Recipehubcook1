import { create } from 'zustand';
import type { Difficulty } from '../data/types';

export interface Filters {
  category: string | null;
  time: number | null; // max cook time in minutes
  difficulty: Difficulty | null;
  cuisine: string | null;
  searchQuery: string;
}

interface FilterState extends Filters {
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  resetFilters: () => void;
}

const initialFilters: Filters = {
  category: null,
  time: null,
  difficulty: null,
  cuisine: null,
  searchQuery: '',
};

export const useFilterStore = create<FilterState>()((set) => ({
  ...initialFilters,

  setFilter: (key, value) => set({ [key]: value }),

  resetFilters: () => set({ ...initialFilters }),
}));
