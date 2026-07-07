import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { RecipeCard } from './RecipeCard';
import { SectionHeader } from './SectionHeader';
import { useTranslation } from 'react-i18next';
import type { Recipe } from '../data/types';
import { stagger, staggerItem, inView } from '../lib/motion';

interface HorizontalRecipesProps {
  recipes: Recipe[];
}

export function HorizontalRecipes({ recipes }: HorizontalRecipesProps) {
  const { t } = useTranslation('t');
  const reduce = useReducedMotion();

  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const isDesktop = window.innerWidth >= 768;
      if (!isDesktop) { setReady(false); return; }
      const tx = Math.max(0, track.scrollWidth - window.innerWidth + 64);
      setTranslateX(tx);
      setReady(true);
    };
    const timer = setTimeout(measure, 80);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(timer); window.removeEventListener('resize', measure); };
  }, [recipes.length, reduce]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const rawX = useTransform(scrollYProgress, [0, 1], [0, -translateX]);
  const x = useSpring(rawX, { stiffness: 65, damping: 22, restDelta: 0.5 });

  const active = ready && translateX > 0 && !reduce;
  const sectionHeight = active ? `calc(100vh + ${translateX}px)` : undefined;

  // ── Mobile: regular vertical stagger grid ──
  if (!active) {
    return (
      <section>
        <SectionHeader
          eyebrow={t('home.popular')}
          title={t('home.featured')}
          subtitle={t('home.popular_sub')}
          seeAllHref="/categories"
        />
        <motion.div
          variants={stagger(0.07)}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2"
        >
          {recipes.slice(0, 6).map((r) => (
            <motion.div key={r.id} variants={staggerItem}>
              <RecipeCard recipe={r} />
            </motion.div>
          ))}
        </motion.div>
      </section>
    );
  }

  // ── Desktop: scroll-linked horizontal track ──
  return (
    <div ref={sectionRef} style={{ height: sectionHeight }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="flex h-full flex-col justify-center gap-8 pt-8">

          {/* Section header — stays pinned */}
          <div className="px-4 sm:px-8 flex items-end justify-between">
            <div>
              <p className="eyebrow mb-2 text-[var(--color-accent)]">{t('home.popular')}</p>
              <h2 className="font-serif text-3xl font-semibold text-[var(--color-text)] sm:text-4xl">
                {t('home.featured')}
              </h2>
            </div>
            {/* Horizontal progress track */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="relative h-[2px] w-24 rounded-full bg-[var(--color-line)]">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-[var(--color-accent)] origin-left"
                  style={{ scaleX: scrollYProgress }}
                />
              </div>
              <span className="text-[0.7rem] font-medium uppercase tracking-widest text-[var(--color-text-tertiary)]">
                scroll
              </span>
            </div>
          </div>

          {/* Horizontal card track */}
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex gap-5 pl-4 sm:pl-8"
          >
            {recipes.map((r) => (
              <div key={r.id} className="w-64 flex-shrink-0 sm:w-72">
                <RecipeCard recipe={r} />
              </div>
            ))}
          </motion.div>

          {/* Bottom hint */}
          <div className="px-4 sm:px-8">
            <motion.p
              className="text-xs text-[var(--color-text-tertiary)]"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              ↓ Keep scrolling to see more
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
