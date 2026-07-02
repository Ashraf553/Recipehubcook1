import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface IngredientChipProps {
  label: string;
  onRemove?: () => void;
}

export function IngredientChip({ label, onRemove }: IngredientChipProps) {
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="inline-flex items-center gap-1.5 rounded-pill border border-[var(--color-line)] bg-[var(--color-bg-secondary)] px-3 py-1.5 text-sm font-medium"
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Удалить ${label}`}
          className="flex h-4 w-4 items-center justify-center rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
        >
          <X size={12} aria-hidden="true" />
        </button>
      )}
    </motion.span>
  );
}
