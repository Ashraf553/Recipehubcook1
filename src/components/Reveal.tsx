import type { ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { inView } from '../lib/motion';

type RevealVariant = 'up' | 'left' | 'right' | 'scale' | 'clip';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  onMount?: boolean;
  variant?: RevealVariant;
}

const easeSmooth = [0.22, 1, 0.36, 1] as const;
const easeClip = [0.16, 1, 0.3, 1] as const;

function makeVariants(variant: RevealVariant, y: number): Variants {
  switch (variant) {
    case 'left':
      return {
        hidden: { opacity: 0, x: -40 },
        visible: { opacity: 1, x: 0 },
      };
    case 'right':
      return {
        hidden: { opacity: 0, x: 40 },
        visible: { opacity: 1, x: 0 },
      };
    case 'scale':
      return {
        hidden: { opacity: 0, scale: 0.92 },
        visible: { opacity: 1, scale: 1 },
      };
    case 'clip':
      return {
        hidden: { clipPath: 'inset(0 100% 0 0)' },
        visible: { clipPath: 'inset(0 0% 0 0)' },
      };
    default:
      return {
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0 },
      };
  }
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  onMount = false,
  variant = 'up',
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  const variants = makeVariants(variant, y);
  const duration = variant === 'clip' ? 1.1 : 0.75;
  const ease = variant === 'clip' ? easeClip : easeSmooth;

  const animateProps = onMount
    ? { animate: 'visible' as const }
    : { whileInView: 'visible' as const, viewport: inView };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      transition={{ duration, ease, delay }}
      {...animateProps}
    >
      {children}
    </motion.div>
  );
}
