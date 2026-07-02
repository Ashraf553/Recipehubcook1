import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../lib/cn';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  /** Use the higher-elevation card variant (feature blocks, dialogs). */
  strong?: boolean;
  /** Smaller corner radius, for compact elements. */
  compact?: boolean;
}

/**
 * Primary warm content surface. (Kept the historical name; it now renders the
 * solid editorial `.card` rather than frosted glass.)
 */
export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, strong, compact, children, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn(
        strong ? 'card-lg' : 'card',
        compact ? 'rounded-glass-sm' : 'rounded-glass',
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  ),
);
GlassCard.displayName = 'GlassCard';
