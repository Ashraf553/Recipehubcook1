import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LogIn, LogOut, UserCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/useAuthStore';
import { LanguageSwitcher } from './LanguageSwitcher';
import { cn } from '../lib/cn';

export function Navbar() {
  const { t } = useTranslation('t');
  const { user, logout } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/categories', label: t('nav.categories') },
    { to: '/favorites', label: t('nav.favorites') },
    { to: '/assistant', label: t('nav.assistant') },
  ];

  return (
    <header className="sticky top-0 z-40 px-4 pt-4">
      <nav
        className={cn(
          'mx-auto flex max-w-6xl items-center justify-between rounded-pill px-3 py-2 transition-all duration-300',
          scrolled ? 'glass-strong' : 'border border-transparent bg-transparent shadow-none',
        )}
      >
        <NavLink to="/" className="group flex items-center gap-2 pl-2">
          <span className="font-serif text-xl font-semibold tracking-tight">RecipeHub</span>
          <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-[var(--color-gold)] transition-transform duration-300 group-hover:scale-150" />
        </NavLink>

        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'cursor-pointer rounded-pill px-4 py-1.5 text-sm font-medium transition-colors duration-200',
                    isActive
                      ? 'bg-[var(--color-text)] text-[var(--color-cream)]'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]',
                  )
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-1.5 sm:flex">
                <UserCircle size={16} className="text-[var(--color-accent)]" aria-hidden="true" />
                <span className="max-w-[100px] truncate text-sm font-medium">{user.username}</span>
              </div>
              <button
                type="button"
                onClick={logout}
                aria-label={t('auth.logout')}
                title={t('auth.logout')}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-text)] transition-colors duration-200 hover:bg-[var(--color-bg-secondary)]"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex h-9 cursor-pointer items-center gap-1.5 rounded-pill bg-[var(--color-accent)] px-4 text-sm font-semibold text-[var(--color-accent-contrast)] shadow-[var(--shadow-card)] transition-colors duration-200 hover:bg-[var(--color-text)]"
            >
              <LogIn size={15} />
              <span className="hidden sm:inline">{t('auth.login')}</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
