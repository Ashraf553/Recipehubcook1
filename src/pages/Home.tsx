import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  useMotionValue,
  animate,
  useInView,
} from 'framer-motion';
import { Sparkles, ArrowRight, ArrowUpRight, ChevronRight } from 'lucide-react';
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

const HERO_IMG =
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=75';

const MARQUEE_ITEMS = [
  'World Recipes',
  'Discover Cuisines',
  'AI Assistant',
  'Taste the World',
  'Cook with Love',
  'Fresh Ingredients',
  'Chef\'s Secrets',
  'Daily Inspiration',
];

function AnimatedStat({
  value,
  suffix = '',
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) {
      const ctrl = animate(mv, value, { duration: 2, ease: [0.22, 1, 0.36, 1] });
      return ctrl.stop;
    }
  }, [isInView, mv, value]);

  useEffect(() => mv.on('change', (v) => setDisplay(Math.round(v))), [mv]);

  return (
    <div ref={ref}>
      <dt className="font-serif text-3xl font-semibold text-[var(--color-cream)] tabular-nums">
        {display}
        {suffix}
      </dt>
      <dd className="mt-1 text-xs uppercase tracking-widest text-[var(--color-cream)]/60">
        {label}
      </dd>
    </div>
  );
}

function Marquee() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-[var(--color-line)] py-3"
    >
      <div className="animate-marquee flex whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-5 px-5 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-text-secondary)]"
          >
            <span
              aria-hidden="true"
              className="h-[5px] w-[5px] rounded-full"
              style={{
                background: i % 2 === 0
                  ? 'var(--color-accent)'
                  : 'var(--color-gold)',
              }}
            />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation('t');
  const reduce = useReducedMotion();
  const user = useAuthStore((s) => s.user);
  const recipes = useRecipeStore((s) => s.recipes);

  const popular = useMemo(
    () => [...recipes].sort((a, b) => b.rating - a.rating).slice(0, 10),
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

  // Spring-smoothed parallax for a more physical feel
  const rawImgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '14%']);
  const imgY = useSpring(rawImgY, { stiffness: 60, damping: 20 });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.06, reduce ? 1.06 : 1.12]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.45]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  // Depth layer — faint horizontal drift on scroll
  const drift = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '3%']);

  // Cursor glow
  const glowRef = useRef<HTMLDivElement>(null);
  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = glowRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  const stats = [
    { value: recipes.length, suffix: '+', label: t('home.stat_recipes') },
    { value: categories.length, suffix: '', label: t('home.stat_categories') },
    { value: cuisineCount, suffix: '', label: t('home.stat_cuisines') },
  ];

  return (
    <div>
      {/* ───── Cinematic hero ───── */}
      <section
        ref={heroRef}
        onPointerMove={handlePointerMove}
        className="relative h-[92vh] min-h-[580px] w-full overflow-hidden"
      >
        {/* Parallax background image */}
        <motion.img
          src={HERO_IMG}
          alt=""
          aria-hidden="true"
          style={{ y: imgY, scale: imgScale }}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Drift layer — subtle horizontal parallax */}
        <motion.div
          aria-hidden="true"
          style={{ x: drift }}
          className="absolute inset-0 bg-gradient-to-r from-[#c2902f]/8 via-transparent to-[#bf4324]/8"
        />

        {/* Dark overlay */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-gradient-to-t from-[#2a1d12]/90 via-[#2a1d12]/48 to-[#2a1d12]/30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2a1d12]/60 to-transparent" />

        {/* Cursor glow */}
        <div
          ref={glowRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-75 mix-blend-soft-light"
          style={{
            background:
              'radial-gradient(420px circle at var(--mx, 70%) var(--my, 30%), rgba(255,224,150,0.55), transparent 65%)',
          }}
        />



        {/* Hero copy */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-16 sm:pb-22"
        >
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: easeOut }}
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
            className="max-w-3xl font-serif text-5xl font-semibold leading-[0.96] text-[var(--color-cream)] sm:text-6xl md:text-7xl"
          />

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: easeOut, delay: 0.52 }}
            className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-[var(--color-cream)]/85 sm:text-lg"
          >
            {t('home.hero_lead')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: easeOut, delay: 0.68 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/categories"
              className="group flex cursor-pointer items-center gap-2 rounded-pill bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-accent-contrast)] shadow-float transition-all duration-300 hover:bg-[var(--color-gold)] hover:shadow-[0_20px_60px_rgba(191,67,36,0.45)] hover:-translate-y-0.5"
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
              className="flex cursor-pointer items-center gap-2 rounded-pill border border-white/30 px-6 py-3 text-sm font-semibold text-[var(--color-cream)] backdrop-blur-sm transition-all duration-300 hover:bg-white/12 hover:border-white/50 hover:-translate-y-0.5"
            >
              <Sparkles size={16} aria-hidden="true" />
              {t('home.cta_assistant')}
            </Link>
          </motion.div>

          {/* Animated stats */}
          <motion.dl
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: easeOut, delay: 0.84 }}
            className="mt-12 flex flex-wrap gap-10 border-t border-white/15 pt-6"
          >
            {stats.map((s) => (
              <AnimatedStat key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
            ))}
          </motion.dl>
        </motion.div>
      </section>

      {/* ───── Marquee ticker ───── */}
      <Marquee />

      {/* ───── Body ───── */}
      <div className="mx-auto max-w-6xl space-y-22 px-4 py-18 sm:py-22">

        {/* Popular recipes */}
        <section>
          <Reveal>
            <SectionHeader
              eyebrow={t('home.popular')}
              title={t('home.featured')}
              subtitle={t('home.popular_sub')}
              seeAllHref="/categories"
            />
          </Reveal>

          {/* Desktop grid */}
          <motion.div
            variants={stagger(0.07)}
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            className="hidden sm:grid grid-cols-2 gap-5 lg:grid-cols-4"
          >
            {popular.slice(0, 8).map((recipe) => (
              <motion.div key={recipe.id} variants={staggerItem}>
                <RecipeCard recipe={recipe} />
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile horizontal scroll */}
          <div className="sm:hidden relative">
            <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
              <motion.div
                variants={stagger(0.06)}
                initial="hidden"
                whileInView="visible"
                viewport={inView}
                className="flex gap-4 pb-2 w-max"
              >
                {popular.map((recipe) => (
                  <motion.div
                    key={recipe.id}
                    variants={staggerItem}
                    className="w-64 flex-shrink-0"
                  >
                    <RecipeCard recipe={recipe} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
            {/* Right edge fade */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-0 bottom-2 w-20 bg-gradient-to-l from-[var(--color-bg)] to-transparent"
            />
          </div>
        </section>

        {/* ──── Feature highlight strip ──── */}
        <Reveal variant="clip">
          <div className="relative overflow-hidden rounded-glass bg-[var(--color-text)] px-8 py-10 sm:px-14 sm:py-12">
            {/* Decorative gradient orbs */}
            <div
              aria-hidden="true"
              className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[var(--color-accent)] opacity-20 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute -right-10 -bottom-16 h-60 w-60 rounded-full bg-[var(--color-gold)] opacity-15 blur-3xl"
            />
            <div className="relative grid gap-8 sm:grid-cols-3">
              {[
                { n: '01', title: 'Find Recipes', body: 'Search from hundreds of hand-curated world recipes sorted by cuisine, difficulty, and cook time.' },
                { n: '02', title: 'Cook & Learn', body: 'Step-by-step instructions with built-in timers make even complex dishes approachable.' },
                { n: '03', title: 'Ask the AI', body: 'Our Claude-powered assistant answers ingredient questions and suggests substitutes in real time.' },
              ].map(({ n, title, body }) => (
                <Reveal key={n} delay={+n * 0.08} variant="up">
                  <p className="eyebrow mb-3 text-[var(--color-gold)]">{n}</p>
                  <h3 className="mb-2 font-serif text-xl font-semibold text-[var(--color-cream)]">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-cream)]/65">{body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Categories */}
        <section>
          <Reveal variant="left">
            <SectionHeader
              eyebrow={t('nav.categories')}
              title={t('categories.title')}
              subtitle={t('home.categories_sub')}
              seeAllHref="/categories"
            />
          </Reveal>
          <motion.div
            variants={stagger(0.055)}
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

        {/* Assistant banner */}
        <Reveal variant="scale">
          <Link
            to="/assistant"
            className="group relative block cursor-pointer overflow-hidden rounded-glass bg-[var(--color-text)] p-8 text-[var(--color-cream)] transition-transform duration-500 hover:-translate-y-1 sm:p-12"
          >
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[var(--color-accent)] opacity-30 blur-3xl transition-all duration-700 group-hover:opacity-55 group-hover:scale-110"
            />
            <div
              aria-hidden="true"
              className="absolute left-1/2 bottom-0 h-40 w-96 -translate-x-1/2 rounded-full bg-[var(--color-gold)] opacity-10 blur-3xl transition-opacity duration-700 group-hover:opacity-20"
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
              <span className="flex shrink-0 items-center gap-2 rounded-pill bg-[var(--color-cream)] px-6 py-3 text-sm font-semibold text-[var(--color-text)] transition-all duration-300 group-hover:translate-x-1 group-hover:shadow-float">
                {t('home.assistant_cta')}
                <ArrowUpRight size={17} aria-hidden="true" />
              </span>
            </div>
          </Link>
        </Reveal>

        {/* Browse all — text link */}
        <Reveal>
          <div className="flex items-center justify-center gap-3 pt-4">
            <span className="h-px flex-1 bg-[var(--color-line)]" />
            <Link
              to="/categories"
              className="group flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent)]"
            >
              Browse all categories
              <ChevronRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
            <span className="h-px flex-1 bg-[var(--color-line)]" />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
