import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { easeOut } from '../lib/motion';

export function AssistantFAB() {
  const { pathname } = useLocation();
  if (pathname === '/assistant') return null;

  return (
    <motion.div
      className="fixed bottom-24 right-4 z-40 md:bottom-8 md:right-8"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: easeOut, delay: 0.3 }}
    >
      <Link
        to="/assistant"
        aria-label="Открыть ИИ-ассистента"
        className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-accent-contrast)] shadow-float transition-colors duration-200 hover:bg-[var(--color-text)]"
      >
        <motion.span whileHover={{ rotate: 12, scale: 1.08 }} whileTap={{ scale: 0.92 }}>
          <Sparkles size={24} aria-hidden="true" />
        </motion.span>
      </Link>
    </motion.div>
  );
}
