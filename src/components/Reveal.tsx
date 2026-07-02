import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { easeOut, inView } from '../lib/motion';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Delay before the reveal starts (seconds). */
  delay?: number;
  /** Vertical travel distance (px). */
  y?: number;
  /** Animate once it scrolls into view (default) or immediately on mount. */
  onMount?: boolean;
}

/**
 * Fades + lifts its children into place once they enter the viewport.
 * Honours prefers-reduced-motion by rendering statically.
 */
export function Reveal({ children, className, delay = 0, y = 24, onMount = false }: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  const animateProps = onMount
    ? { animate: { opacity: 1, y: 0 } }
    : { whileInView: { opacity: 1, y: 0 }, viewport: inView };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      transition={{ duration: 0.7, ease: easeOut, delay }}
      {...animateProps}
    >
      {children}
    </motion.div>
  );
}
