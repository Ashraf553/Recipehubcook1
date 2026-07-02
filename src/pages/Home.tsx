import { useEffect, useMemo, useRef, useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RecipeCard } from '../components/RecipeCard';
import { CategoryCard } from '../components/CategoryCard';
import { SectionHeader } from '../components/SectionHeader';
import { AnimatedHeading } from '../components/AnimatedHeading';
import { Reveal } from '../components/Reveal';
import { categories } from '../data/categories';
import { useRecipeStore } from '../stores/useRecipeStore';
import { useAuthStore } from '../stores/useAuthStore';
import { easeOut, stagger, staggerItem, inView } from '../lib/motion';

const HeroDonuts = lazy(() => import('../components/HeroDonuts'));

const HERO_IMG =
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=75';

export default function Home() {
  const { t } = useTranslation('t');
  const reduce = useReducedMotion();
  const user = useAuthStore((s) => s.user);
  const recipes = useRecipeStore((s) => s.recipes);

  const popular = useMemo(
    () => [...recipes].sort((a, b) => b.rating - a.rating).slice(0, 8),
    [recipes],
  );
  const quickCategories = categories.slice(0, 8);
  const cuisineCount = useMemo(
    () => new Set(recipes.map((r) => r.cuisine)).size,
    [recipes],
  );

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '12%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, reduce ? 1.05 : 1.1]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.5]);
  // Hero copy drifts up + fades as you scroll past it
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -70]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Only run the WebGL 3D layer on capable, non-touch, wide viewports.
  const [show3D, setShow3D] = useState(false);
  useEffect(() => {
    if (reduce) return;
    const mq = window.matchMedia('(min-width: 768px)');
    setShow3D(mq.matches);
    const onChange = () => setShow3D(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [reduce]);

  // Cursor glow inside the hero
  const glowRef = useRef<HTMLDivElement>(null);
  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = glowRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  const stats = [
    { value: `${recipes.length}+`, label: t('home.stat_recipes') },
    { value: `${categories.length}`, label: t('home.stat_categories') },
    { value: `${cuisineCount}`, label: t('home.stat_cuisines') },
  ];

  return (
    <div>
      {/* ───── Cinematic hero ───── */}
      <section
        ref={heroRef}
        onPointerMove={handlePointerMove}
        className="relative h-[90vh] min-h-[560px] w-full overflow-hidden"
      >
        <motion.img
          src={HERO_IMG}
          alt=""
          aria-hidden="true"
          style={{ y: imgY, scale: imgScale }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-gradient-to-t from-[#2a1d12]/85 via-[#2a1d12]/45 to-[#2a1d12]/35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2a1d12]/55 to-transparent" />

        {/* Cursor glow */}
        <div
          ref={glowRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70 mix-blend-soft-light"
          style={{
            background:
              'radial-gradient(380px circle at var(--mx, 70%) var(--my, 30%), rgba(255,224,150,0.5), transparent 65%)',
          }}
        />

        {/* 3D floating donuts (desktop, motion-on only) */}
        {show3D && (
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <Suspense fallback={null}>
              <HeroDonuts />
            </Suspense>
          </div>
        )}

        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-16 sm:pb-20">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="eyebrow mb-4 text-[var(--color-gold)]"
          >
            {t('home.eyebrow')}
          </motion.p>

          <AnimatedHeading
            as="h1"
            text={
              user
                ? `${t('auth.welcome')}, ${user.username}`
                : `${t('home.hero_title')} ${t('home.hero_accent')}`
            }
            accent={user ? undefined : t('home.hero_accent')}
            className="max-w-3xl font-serif text-5xl font-semibold leading-[0.98] text-[var(--color-cream)] sm:text-6xl md:text-7xl"
          />

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.5 }}
            className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-[var(--color-cream)]/85 sm:text-lg"
          >
            {t('home.hero_lead')}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.65 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/categories"
              className="group flex cursor-pointer items-center gap-2 rounded-pill bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-accent-contrast)] shadow-float transition-colors duration-200 hover:bg-[var(--color-gold)]"
            >
              {t('home.cta_explore')}
              <ArrowRight
                size={17}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
            <Link
              to="/assistant"
              className="flex cursor-pointer items-center gap-2 rounded-pill border border-white/30 px-6 py-3 text-sm font-semibold text-[var(--color-cream)] backdrop-blur-sm transition-colors duration-200 hover:bg-white/10"
            >
              <Sparkles size={16} aria-hidden="true" />
              {t('home.cta_assistant')}
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.dl
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.8 }}
            className="mt-12 flex flex-wrap gap-10 border-t border-white/15 pt-6"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-serif text-3xl font-semibold text-[var(--color-cream)]">
                  {s.value}
                </dt>
                <dd className="mt-1 text-xs uppercase tracking-widest text-[var(--color-cream)]/60">
                  {s.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </section>

      {/* ───── Body ───── */}
      <div className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:py-20">
        {/* Popular recipes */}
        <section>
          <SectionHeader
            eyebrow={t('home.popular')}
            title={t('home.featured')}
            subtitle={t('home.popular_sub')}
            seeAllHref="/categories"
          />
          <motion.div
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {popular.map((recipe) => (
              <motion.div key={recipe.id} variants={staggerItem}>
                <RecipeCard recipe={recipe} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Categories */}
        <section>
          <SectionHeader
            eyebrow={t('nav.categories')}
            title={t('categories.title')}
            subtitle={t('home.categories_sub')}
            seeAllHref="/categories"
          />
          <motion.div
            variants={stagger(0.06)}
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4"
          >
            {quickCategories.map((category) => (
              <motion.div key={category.slug} variants={staggerItem}>
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Assistant feature banner */}
        <Reveal>
          <Link
            to="/assistant"
            className="group relative block cursor-pointer overflow-hidden rounded-glass bg-[var(--color-text)] p-8 text-[var(--color-cream)] sm:p-12"
          >
            <div
              className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[var(--color-accent)] opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-50"
              aria-hidden="true"
            />
            <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div className="max-w-xl">
                <p className="eyebrow mb-3 text-[var(--color-gold)]">
                  {t('home.assistant_eyebrow')}
                </p>
                <h3 className="font-serif text-3xl font-semibold sm:text-4xl">
                  {t('assistant.title')}
                </h3>
                <p className="mt-3 text-[var(--color-cream)]/75">{t('assistant.subtitle')}</p>
              </div>
              <span className="flex shrink-0 items-center gap-2 rounded-pill bg-[var(--color-cream)] px-6 py-3 text-sm font-semibold text-[var(--color-text)] transition-transform duration-200 group-hover:translate-x-1">
                {t('home.assistant_cta')}
                <ArrowUpRight size={17} aria-hidden="true" />
              </span>
            </div>
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
