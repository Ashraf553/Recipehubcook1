import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { easeOut } from '../lib/motion';

const PANEL_IMG =
  'https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1200&q=80';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

/** Editorial split-screen shell for the auth pages. */
export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  const { t } = useTranslation('t');

  return (
    <div className="mx-auto grid min-h-[78vh] max-w-6xl items-stretch gap-8 px-4 py-6 lg:grid-cols-2">
      {/* Visual panel */}
      <div className="relative hidden overflow-hidden rounded-glass lg:block">
        <img src={PANEL_IMG} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2a1d12]/90 via-[#2a1d12]/40 to-[#2a1d12]/30" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <Link to="/" className="flex items-center gap-2 text-[var(--color-cream)]">
            <span className="font-serif text-2xl font-semibold">RecipeHub</span>
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
          </Link>
          <blockquote className="max-w-sm">
            <p className="font-serif text-3xl font-medium leading-tight text-[var(--color-cream)]">
              «Хорошая еда — это память, которую мы создаём каждый день.»
            </p>
            <footer className="mt-4 text-sm uppercase tracking-widest text-[var(--color-cream)]/60">
              RecipeHub
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Form panel */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeOut }}
        className="flex items-center justify-center"
      >
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <p className="eyebrow mb-3 text-[var(--color-accent)]">{t('nav.home')} · RecipeHub</p>
            <h1 className="font-serif text-4xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 text-[var(--color-text-secondary)]">{subtitle}</p>
          </div>
          <div className="card rounded-glass p-6 sm:p-7">{children}</div>
        </div>
      </motion.div>
    </div>
  );
}
