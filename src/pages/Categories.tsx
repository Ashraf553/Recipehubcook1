import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CategoryCard } from '../components/CategoryCard';
import { AnimatedHeading } from '../components/AnimatedHeading';
import { categories } from '../data/categories';
import { stagger, staggerItem, inView } from '../lib/motion';

export default function Categories() {
  const { t } = useTranslation('t');

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-10 max-w-2xl">
        <p className="eyebrow mb-3 text-[var(--color-accent)]">{t('nav.categories')}</p>
        <AnimatedHeading
          as="h1"
          text={t('categories.title')}
          className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl"
        />
        <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
          {t('categories.subtitle')}
        </p>
      </header>

      <motion.div
        className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4"
        variants={stagger(0.06)}
        initial="hidden"
        whileInView="visible"
        viewport={inView}
      >
        {categories.map((category) => (
          <motion.div key={category.slug} variants={staggerItem}>
            <CategoryCard category={category} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
