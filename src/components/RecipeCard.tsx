import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Recipe } from '../data/types';
import { useRecipeStore } from '../stores/useRecipeStore';
import { difficultyLabels, formatCookTime } from '../lib/format';
import { RatingStars } from './RatingStars';
import { cn } from '../lib/cn';

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
}

export function RecipeCard({ recipe, className }: RecipeCardProps) {
  const { t } = useTranslation('t');
  const isFavorite = useRecipeStore((s) => s.isFavorite(recipe.id));
  const toggleFavorite = useRecipeStore((s) => s.toggleFavorite);

  return (
    <motion.article
      className={cn('group card relative overflow-hidden rounded-glass', className)}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <Link to={`/recipe/${recipe.id}`} className="block cursor-pointer">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.title}
            loading="lazy"
            decoding="async"
            className="img-breathe h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

          <span className="glass-dark absolute left-3 top-3 rounded-pill px-3 py-1 text-xs font-medium tracking-wide text-white">
            {recipe.cuisine}
          </span>

          {/* Title sits over the image, editorial-style */}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="text-balance font-serif text-lg font-semibold leading-tight text-white">
              {recipe.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 text-xs text-[var(--color-text-secondary)]">
          <span className="inline-flex items-center gap-1">
            <Clock size={14} aria-hidden="true" />
            {formatCookTime(recipe.cookTimeMinutes)} {t('recipe.min')}
          </span>
          <span className="h-1 w-1 rounded-full bg-[var(--color-line-strong)]" />
          <span>{difficultyLabels[recipe.difficulty]}</span>
          <RatingStars rating={recipe.rating} className="ml-auto" />
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggleFavorite(recipe.id)}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
        className="glass-dark absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white transition-transform duration-200 hover:scale-110 active:scale-90"
      >
        <Heart
          size={17}
          className={cn(
            'transition-colors',
            isFavorite ? 'fill-white text-white' : 'fill-none text-white',
          )}
        />
      </button>
    </motion.article>
  );
}
