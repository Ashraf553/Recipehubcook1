import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  EggFried,
  Soup,
  UtensilsCrossed,
  Salad,
  IceCreamCone,
  Croissant,
  CupSoda,
  Sprout,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import type { Category, CategorySlug } from '../data/types';

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

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = icons[category.slug];

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
      <Link
        to={`/category/${category.slug}`}
        className="group card relative flex h-full cursor-pointer flex-col gap-4 overflow-hidden rounded-glass p-5"
        style={{ '--color-accent': category.accent } as CSSProperties}
      >
        <div
          className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
          style={{ background: category.accent }}
          aria-hidden="true"
        />
        <div className="flex items-start justify-between">
          <span className="flex h-12 w-12 items-center justify-center rounded-glass-sm bg-[var(--color-accent)]/12 text-[var(--color-accent)]">
            <Icon size={22} aria-hidden="true" />
          </span>
          <ArrowUpRight
            size={18}
            aria-hidden="true"
            className="translate-y-1 text-[var(--color-text-tertiary)] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          />
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold">{category.title}</h3>
          <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
            {category.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
