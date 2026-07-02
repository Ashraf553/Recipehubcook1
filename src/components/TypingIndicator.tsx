import { motion } from 'framer-motion';
import { ChefHat } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2" aria-live="polite" aria-label="Ассистент печатает">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-white">
        <ChefHat size={14} aria-hidden="true" />
      </span>
      <div className="glass flex items-center gap-1 rounded-glass rounded-bl-glass-sm px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-[var(--color-text-tertiary)]"
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}
