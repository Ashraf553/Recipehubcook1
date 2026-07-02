import { useRef, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowLeft, Clock, ChefHat, Minus, Plus, Heart, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRecipeStore } from '../stores/useRecipeStore';
import { useAccentStyle } from '../hooks/useAccentStyle';
import { formatCookTime } from '../lib/format';
import { RatingStars } from '../components/RatingStars';
import { GlassCard } from '../components/GlassCard';
import { StepTimer } from '../components/StepTimer';
import { Reveal } from '../components/Reveal';
import { AnimatedHeading } from '../components/AnimatedHeading';

export default function RecipeDetail() {
  const { t } = useTranslation('t');
  const reduce = useReducedMotion();
  const { id = '' } = useParams();
  const recipe = useRecipeStore((s) => s.getById(id));
  const isFavorite = useRecipeStore((s) => s.isFavorite(id));
  const toggleFavorite = useRecipeStore((s) => s.toggleFavorite);
  const accentStyle = useAccentStyle(recipe?.category);
  const [servings, setServings] = useState(recipe?.servings ?? 1);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '12%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, reduce ? 1.05 : 1.1]);

  if (!recipe) return <Navigate to="/categories" replace />;

  const ratio = servings / recipe.servings;
  const difficultyLabel: Record<string, string> = {
    easy: t('difficulty.easy'),
    medium: t('difficulty.medium'),
    hard: t('difficulty.hard'),
  };

  return (
    <div style={accentStyle}>
      {/* ───── Cinematic hero ───── */}
      <section ref={heroRef} className="relative h-[68vh] min-h-[440px] w-full overflow-hidden">
        <motion.img
          src={recipe.image}
          alt={recipe.title}
          style={{ y: imgY, scale: imgScale }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2a1d12]/90 via-[#2a1d12]/35 to-[#2a1d12]/30" />

        <Link
          to={`/category/${recipe.category}`}
          className="glass-dark absolute left-4 top-4 flex cursor-pointer items-center gap-1.5 rounded-pill px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black/50"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          {recipe.cuisine}
        </Link>
        <button
          type="button"
          onClick={() => toggleFavorite(recipe.id)}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? t('recipe.remove_favorite') : t('recipe.add_favorite')}
          className="glass-dark absolute right-4 top-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-white transition-transform duration-200 hover:scale-110 active:scale-90"
        >
          <Heart size={18} className={isFavorite ? 'fill-white text-white' : 'fill-none'} />
        </button>

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-4xl px-4 pb-10">
            <p className="eyebrow mb-3 text-[var(--color-gold)]">{recipe.cuisine}</p>
            <AnimatedHeading
              as="h1"
              text={recipe.title}
              className="max-w-3xl font-serif text-4xl font-semibold leading-[1.02] text-[var(--color-cream)] sm:text-5xl"
            />
          </div>
        </div>
      </section>

      {/* ───── Body ───── */}
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Reveal>
          <p className="text-pretty text-lg leading-relaxed text-[var(--color-text-secondary)]">
            {recipe.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <span className="card inline-flex items-center gap-1.5 rounded-pill px-4 py-2 text-sm">
              <Clock size={15} aria-hidden="true" /> {formatCookTime(recipe.cookTimeMinutes)}{' '}
              {t('recipe.min')}
            </span>
            <span className="card inline-flex items-center gap-1.5 rounded-pill px-4 py-2 text-sm">
              <ChefHat size={15} aria-hidden="true" /> {difficultyLabel[recipe.difficulty]}
            </span>
            <span className="card inline-flex items-center rounded-pill px-4 py-2">
              <RatingStars rating={recipe.rating} />
            </span>
          </div>
        </Reveal>

        {/* Ingredients */}
        <Reveal delay={0.05}>
          <GlassCard className="mt-10 p-6 sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-semibold">{t('recipe.ingredients')}</h2>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setServings((s) => Math.max(1, s - 1))}
                  aria-label="−"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[var(--color-line)] transition-colors hover:border-[var(--color-accent)]"
                >
                  <Minus size={14} />
                </button>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium tabular-nums">
                  <Users size={15} aria-hidden="true" /> {servings}
                </span>
                <button
                  type="button"
                  onClick={() => setServings((s) => s + 1)}
                  aria-label="+"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[var(--color-line)] transition-colors hover:border-[var(--color-accent)]"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <ul className="space-y-0">
              {recipe.ingredients.map((ing) => (
                <li
                  key={ing.name}
                  className="flex items-center justify-between border-b border-[var(--color-line)] py-3 text-[15px] last:border-0"
                >
                  <span>{ing.name}</span>
                  <span className="font-medium tabular-nums text-[var(--color-text-secondary)]">
                    {Math.round(ing.amount * ratio * 10) / 10} {ing.unit}
                  </span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </Reveal>

        {/* Steps */}
        <Reveal delay={0.05}>
          <GlassCard className="mt-6 p-6 sm:p-7">
            <h2 className="mb-6 font-serif text-2xl font-semibold">{t('recipe.steps')}</h2>
            <ol className="space-y-6">
              {recipe.steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] font-serif text-sm font-semibold text-[var(--color-accent-contrast)]">
                    {i + 1}
                  </span>
                  <div className="pt-1">
                    <p className="font-semibold">{step.title}</p>
                    <p className="mt-0.5 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                      {step.description}
                    </p>
                    {step.durationMinutes && <StepTimer minutes={step.durationMinutes} />}
                  </div>
                </li>
              ))}
            </ol>
          </GlassCard>
        </Reveal>

        {/* Nutrition */}
        <Reveal delay={0.05}>
          <GlassCard className="mt-6 p-6 sm:p-7">
            <h2 className="mb-5 font-serif text-2xl font-semibold">{t('recipe.nutrition')}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: t('recipe.calories'), value: `${recipe.nutrition.calories}` },
                { label: t('recipe.protein'), value: `${recipe.nutrition.protein} г` },
                { label: t('recipe.fat'), value: `${recipe.nutrition.fat} г` },
                { label: t('recipe.carbs'), value: `${recipe.nutrition.carbs} г` },
              ].map((n) => (
                <div
                  key={n.label}
                  className="rounded-glass-sm border border-[var(--color-line)] bg-[var(--color-bg-secondary)] p-4 text-center"
                >
                  <p className="font-serif text-2xl font-semibold text-[var(--color-accent)]">
                    {n.value}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{n.label}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </div>
  );
}
