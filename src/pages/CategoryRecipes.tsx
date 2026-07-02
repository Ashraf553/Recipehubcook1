import { useMemo, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  SlidersHorizontal,
  Search,
  EggFried,
  Soup,
  UtensilsCrossed,
  Salad,
  IceCreamCone,
  Croissant,
  CupSoda,
  Sprout,
  type LucideIcon,
} from 'lucide-react';
import { getCategory } from '../data/categories';
import { useRecipeStore } from '../stores/useRecipeStore';
import { useFilterStore } from '../stores/useFilterStore';
import { useAccentStyle } from '../hooks/useAccentStyle';
import { RecipeCard } from '../components/RecipeCard';
import { BottomSheet } from '../components/BottomSheet';
import { AnimatedHeading } from '../components/AnimatedHeading';
import { cn } from '../lib/cn';
import { stagger, staggerItem, inView } from '../lib/motion';
import type { CategorySlug, Difficulty } from '../data/types';

const icons: Record<CategorySlug, LucideIcon> = {
  breakfast: EggFried,
  soups: Soup,
  main: UtensilsCrossed,
  salads: Salad,
  desserts: IceCreamCone,
  baking: Croissant,
  drinks: CupSoda,
  vegan: Sprout,
};

const difficulties: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Легко' },
  { value: 'medium', label: 'Средне' },
  { value: 'hard', label: 'Сложно' },
];

const timeOptions = [
  { value: 15, label: 'До 15 мин' },
  { value: 30, label: 'До 30 мин' },
  { value: 60, label: 'До 60 мин' },
];

const chip = (active: boolean) =>
  cn(
    'cursor-pointer rounded-pill px-4 py-1.5 text-sm font-medium transition-colors duration-200',
    active
      ? 'bg-[var(--color-accent)] text-[var(--color-accent-contrast)]'
      : 'border border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-text)]',
  );

export default function CategoryRecipes() {
  const { slug = '' } = useParams();
  const category = getCategory(slug);
  const accentStyle = useAccentStyle(slug);
  const allRecipes = useRecipeStore((s) => s.recipes);
  const recipes = useMemo(
    () => allRecipes.filter((r) => r.category === slug),
    [allRecipes, slug],
  );
  const { time, difficulty, cuisine, searchQuery, setFilter, resetFilters } = useFilterStore();
  const [sheetOpen, setSheetOpen] = useState(false);

  const cuisines = useMemo(
    () => Array.from(new Set(recipes.map((r) => r.cuisine))),
    [recipes],
  );

  const filtered = useMemo(
    () =>
      recipes.filter((r) => {
        if (time && r.cookTimeMinutes > time) return false;
        if (difficulty && r.difficulty !== difficulty) return false;
        if (cuisine && r.cuisine !== cuisine) return false;
        if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase()))
          return false;
        return true;
      }),
    [recipes, time, difficulty, cuisine, searchQuery],
  );

  if (!category) return <Navigate to="/categories" replace />;

  const Icon = icons[category.slug];
  const activeFilterCount = [time, difficulty, cuisine].filter(Boolean).length;

  const filterPanel = (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-sm font-semibold">Время приготовления</p>
        <div className="flex flex-wrap gap-2">
          {timeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilter('time', time === opt.value ? null : opt.value)}
              className={chip(time === opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">Сложность</p>
        <div className="flex flex-wrap gap-2">
          {difficulties.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilter('difficulty', difficulty === opt.value ? null : opt.value)}
              className={chip(difficulty === opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {cuisines.length > 1 && (
        <div>
          <p className="mb-2 text-sm font-semibold">Кухня</p>
          <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto">
            {cuisines.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilter('cuisine', cuisine === c ? null : c)}
                className={chip(cuisine === c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={resetFilters}
          className="cursor-pointer text-sm font-medium text-[var(--color-accent)]"
        >
          Сбросить фильтры
        </button>
      )}
    </div>
  );

  return (
    <div style={accentStyle} className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8 flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-glass-sm bg-[var(--color-accent)]/12 text-[var(--color-accent)]">
          <Icon size={26} aria-hidden="true" />
        </span>
        <div>
          <AnimatedHeading
            as="h1"
            text={category.title}
            className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl"
          />
          <p className="mt-1 text-[var(--color-text-secondary)]">{category.description}</p>
        </div>
      </header>

      <div className="mb-8 flex items-center gap-2">
        <label className="card flex flex-1 items-center gap-2 rounded-pill px-4 py-2.5">
          <Search size={16} className="text-[var(--color-text-tertiary)]" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setFilter('searchQuery', e.target.value)}
            placeholder="Поиск рецептов..."
            aria-label="Поиск рецептов"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-text-tertiary)]"
          />
        </label>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-label="Открыть фильтры"
          className="card relative flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:border-[var(--color-accent)]"
        >
          <SlidersHorizontal size={17} aria-hidden="true" />
          {activeFilterCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-bold text-[var(--color-accent-contrast)]">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-[var(--color-text-secondary)]">
          Рецепты не найдены. Попробуйте изменить фильтры.
        </p>
      ) : (
        <motion.div
          key={`${slug}-${time}-${difficulty}-${cuisine}-${searchQuery}`}
          variants={stagger(0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((recipe) => (
            <motion.div key={recipe.id} variants={staggerItem}>
              <RecipeCard recipe={recipe} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} title="Фильтры">
        {filterPanel}
      </BottomSheet>
    </div>
  );
}
