import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChefHat } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/useAuthStore';
import { easeOut } from '../lib/motion';

export function WelcomeBanner() {
  const { t } = useTranslation('t');
  const { user, justLoggedIn, clearJustLoggedIn } = useAuthStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (justLoggedIn && user) {
      setVisible(true);
      clearJustLoggedIn();
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [justLoggedIn, user, clearJustLoggedIn]);

  return (
    <AnimatePresence>
      {visible && user && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: easeOut }}
          className="fixed left-1/2 top-20 z-50 -translate-x-1/2"
        >
          <div className="glass-strong flex items-center gap-3 rounded-glass-sm px-5 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-accent-contrast)]">
              <ChefHat size={18} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold">
                {t('auth.welcome')}, {user.username}!
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">RecipeHub</p>
            </div>
            <button
              type="button"
              onClick={() => setVisible(false)}
              aria-label={t('auth.logout')}
              className="ml-2 cursor-pointer text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)]"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
