import type { Category } from './types';

export const categories: Category[] = [
  {
    slug: 'breakfast',
    title: 'Завтраки',
    description: 'Бодрое начало дня',
    emoji: '🍳',
    accent: 'var(--color-accent-breakfast)',
  },
  {
    slug: 'soups',
    title: 'Супы',
    description: 'Тёплое и наваристое',
    emoji: '🍲',
    accent: 'var(--color-accent-soups)',
  },
  {
    slug: 'main',
    title: 'Основные блюда',
    description: 'Сытные и сбалансированные',
    emoji: '🍝',
    accent: 'var(--color-accent-main)',
  },
  {
    slug: 'salads',
    title: 'Салаты',
    description: 'Свежо и легко',
    emoji: '🥗',
    accent: 'var(--color-accent-salads)',
  },
  {
    slug: 'desserts',
    title: 'Десерты',
    description: 'Сладкое наслаждение',
    emoji: '🍰',
    accent: 'var(--color-accent-desserts)',
  },
  {
    slug: 'baking',
    title: 'Выпечка',
    description: 'Свежий хлеб и пироги',
    emoji: '🥐',
    accent: 'var(--color-accent-baking)',
  },
  {
    slug: 'drinks',
    title: 'Напитки',
    description: 'Освежающе и ароматно',
    emoji: '🥤',
    accent: 'var(--color-accent-drinks)',
  },
  {
    slug: 'vegan',
    title: 'Веганское',
    description: 'Только растительное',
    emoji: '🌱',
    accent: 'var(--color-accent-vegan)',
  },
];

export const getCategory = (slug: string) =>
  categories.find((c) => c.slug === slug);
