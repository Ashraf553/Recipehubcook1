import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

interface BadgeProps {
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Badge({ icon, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-xs font-medium',
        'bg-[var(--color-bg-secondary)]/70 text-[var(--color-text-secondary)]',
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
