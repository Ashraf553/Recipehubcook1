import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation('t');
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 px-4 py-32 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-accent)]/12 text-[var(--color-accent)]">
        <ChefHat size={32} aria-hidden="true" />
      </span>
      <p className="eyebrow text-[var(--color-accent)]">404</p>
      <h1 className="font-serif text-4xl font-semibold">{t('not_found.title')}</h1>
      <Link
        to="/"
        className="mt-2 cursor-pointer rounded-pill bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-accent-contrast)] transition-colors hover:bg-[var(--color-text)]"
      >
        {t('not_found.back')}
      </Link>
    </div>
  );
}
