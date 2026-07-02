import { NavLink } from 'react-router-dom';
import { Home, LayoutGrid, Heart, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/cn';

export function BottomTabBar() {
  const { t } = useTranslation('t');

  const tabs = [
    { to: '/', label: t('nav.home'), icon: Home, end: true },
    { to: '/categories', label: t('nav.categories'), icon: LayoutGrid, end: false },
    { to: '/favorites', label: t('nav.favorites'), icon: Heart, end: false },
    { to: '/assistant', label: t('nav.assistant'), icon: Sparkles, end: false },
  ];

  return (
    <nav
      className="glass-strong fixed inset-x-3 bottom-3 z-40 flex items-center justify-between rounded-pill px-2 py-2 md:hidden"
      aria-label="Navigation"
    >
      {tabs.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'flex flex-1 cursor-pointer flex-col items-center gap-0.5 rounded-pill py-1.5 text-[11px] font-medium transition-colors duration-200',
              isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]',
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                size={20}
                className={isActive ? 'fill-[var(--color-accent)]/15' : ''}
                aria-hidden="true"
              />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
