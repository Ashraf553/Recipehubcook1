export type CategorySlug =
  | 'breakfast'
  | 'soups'
  | 'main'
  | 'salads'
  | 'desserts'
  | 'baking'
  | 'drinks'
  | 'vegan';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Category {
  slug: CategorySlug;
  title: string;
  description: string;
  emoji: string;
  accent: string;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface NutritionFacts {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface RecipeStep {
  title: string;
  description: string;
  durationMinutes?: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: CategorySlug;
  cuisine: string;
  image: string;
  cookTimeMinutes: number;
  difficulty: Difficulty;
  rating: number;
  servings: number;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  nutrition: NutritionFacts;
  tags: string[];
}

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
}

export type DietaryRestriction =
  | 'vegan'
  | 'vegetarian'
  | 'gluten-free'
  | 'lactose-free'
  | 'low-calorie'
  | 'nut-free';
