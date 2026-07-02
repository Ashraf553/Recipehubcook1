import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  seeAllHref?: string;
}

export function SectionHeader({ title, subtitle, eyebrow, seeAllHref }: SectionHeaderProps) {
  const { t } = useTranslation('t');

  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="eyebrow mb-2 text-[var(--color-accent)]">{eyebrow}</p>
        )}
        <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-[var(--color-text-secondary)]">{subtitle}</p>
        )}
      </div>
      {seeAllHref && (
        <Link
          to={seeAllHref}
          className="group flex shrink-0 cursor-pointer items-center gap-1.5 border-b border-transparent pb-0.5 text-sm font-medium text-[var(--color-text)] transition-colors duration-200 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          {t('home.see_all')}
          <ArrowRight
            size={16}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      )}
    </div>
  );
}
