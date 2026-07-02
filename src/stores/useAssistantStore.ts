import { create } from 'zustand';
import { askChefAssistant } from '../lib/api';
import type { ChatMessage, DietaryRestriction } from '../data/types';

const welcomeMessage: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Привет! Я твой шеф-ассистент 👩‍🍳 Добавь ингредиенты, которые есть под рукой, и я придумаю для тебя блюдо с пошаговым рецептом.',
  createdAt: Date.now(),
};

interface AssistantState {
  messages: ChatMessage[];
  ingredients: string[];
  isLoading: boolean;
  error: string | null;
  dietaryRestrictions: DietaryRestriction[];

  addMessage: (role: ChatMessage['role'], content: string) => void;
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  toggleDietaryRestriction: (restriction: DietaryRestriction) => void;
  sendToAI: (text?: string) => Promise<void>;
  clearChat: () => void;
}

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const useAssistantStore = create<AssistantState>()((set, get) => ({
  messages: [welcomeMessage],
  ingredients: [],
  isLoading: false,
  error: null,
  dietaryRestrictions: [],

  addMessage: (role, content) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { id: makeId(), role, content, createdAt: Date.now() },
      ],
    })),

  addIngredient: (ingredient) => {
    const value = ingredient.trim();
    if (!value) return;
    set((state) =>
      state.ingredients.includes(value)
        ? state
        : { ingredients: [...state.ingredients, value] },
    );
  },

  removeIngredient: (ingredient) =>
    set((state) => ({
      ingredients: state.ingredients.filter((i) => i !== ingredient),
    })),

  toggleDietaryRestriction: (restriction) =>
    set((state) => ({
      dietaryRestrictions: state.dietaryRestrictions.includes(restriction)
        ? state.dietaryRestrictions.filter((r) => r !== restriction)
        : [...state.dietaryRestrictions, restriction],
    })),

  sendToAI: async (text) => {
    const { messages, ingredients, dietaryRestrictions, addMessage } = get();
    const userText =
      text?.trim() ||
      (ingredients.length
        ? `У меня есть: ${ingredients.join(', ')}. Что можно приготовить?`
        : '');

    if (!userText) return;

    addMessage('user', userText);
    set({ isLoading: true, error: null });

    try {
      const { reply } = await askChefAssistant({
        messages: [
          ...messages,
          { id: makeId(), role: 'user' as const, content: userText, createdAt: Date.now() },
        ].map(({ role, content }) => ({ role, content })),
        ingredients,
        dietaryRestrictions,
      });
      addMessage('assistant', reply);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Не удалось связаться с ассистентом';
      set({ error: message });
      addMessage(
        'assistant',
        'Упс, не получилось получить ответ. Проверь подключение к серверу и попробуй снова 🙏',
      );
    } finally {
      set({ isLoading: false });
    }
  },

  clearChat: () => set({ messages: [welcomeMessage], ingredients: [], error: null }),
}));
