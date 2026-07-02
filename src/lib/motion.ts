import type { Variants } from 'framer-motion';

/** Shared editorial easing — a soft, confident ease-out. */
export const easeOut = [0.22, 1, 0.36, 1] as const;

/** Fade + rise, used for most on-scroll reveals. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
};

/** Container that staggers its direct children. */
export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

/** Single staggered item to pair with `stagger`. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

/** Default viewport config for whileInView reveals. */
export const inView = { once: true, margin: '-80px' } as const;
