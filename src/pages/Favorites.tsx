import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRecipeStore } from '../stores/useRecipeStore';
import { RecipeCard } from '../components/RecipeCard';
import { AnimatedHeading } from '../components/AnimatedHeading';
import { stagger, staggerItem, inView } from '../lib/motion';

export default function Favorites() {
  const { t } = useTranslation('t');
  const allRecipes = useRecipeStore((s) => s.recipes);
  const favoriteIds = useRecipeStore((s) => s.favorites);
  const favorites = useMemo(
    () => allRecipes.filter((r) => favoriteIds.includes(r.id)),
    [allRecipes, favoriteIds],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-10 max-w-2xl">
        <p className="eyebrow mb-3 text-[var(--color-accent)]">{t('nav.favorites')}</p>
        <AnimatedHeading
          as="h1"
          text={t('favorites.title')}
          className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl"
        />
        <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
          {t('favorites.empty_sub')}
        </p>
      </header>

      {favorites.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 rounded-glass px-6 py-20 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)]/12 text-[var(--color-accent)]">
            <Heart size={26} aria-hidden="true" />
          </span>
          <p className="font-serif text-xl font-semibold">{t('favorites.empty')}</p>
          <p className="max-w-sm text-sm text-[var(--color-text-secondary)]">
            {t('favorites.empty_sub')}
          </p>
          <Link
            to="/categories"
            className="mt-3 cursor-pointer rounded-pill bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-accent-contrast)] transition-colors hover:bg-[var(--color-text)]"
          >
            {t('home.all_recipes')}
          </Link>
        </div>
      ) : (
        <motion.div
          variants={stagger(0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {favorites.map((recipe) => (
            <motion.div key={recipe.id} variants={staggerItem}>
              <RecipeCard recipe={recipe} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
