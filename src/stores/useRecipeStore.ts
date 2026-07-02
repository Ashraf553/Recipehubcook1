import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { recipes as recipeData } from '../data/recipes';
import type { Recipe } from '../data/types';

interface RecipeState {
  recipes: Recipe[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  getByCategory: (slug: string) => Recipe[];
  getById: (id: string) => Recipe | undefined;
  getFavoriteRecipes: () => Recipe[];
}

export const useRecipeStore = create<RecipeState>()(
  persist(
    (set, get) => ({
      recipes: recipeData,
      favorites: [],

      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((f) => f !== id)
            : [...state.favorites, id],
        })),

      isFavorite: (id) => get().favorites.includes(id),

      getByCategory: (slug) => get().recipes.filter((r) => r.category === slug),

      getById: (id) => get().recipes.find((r) => r.id === id),

      getFavoriteRecipes: () =>
        get().recipes.filter((r) => get().favorites.includes(r.id)),
    }),
    {
      name: 'recipehub-favorites',
      partialize: (state) => ({ favorites: state.favorites }),
    },
  ),
);
