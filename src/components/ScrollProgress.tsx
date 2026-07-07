import { useScroll, useSpring, motion } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 h-[2px] origin-left pointer-events-none"
      style={{
        scaleX,
        background:
          'linear-gradient(90deg, var(--color-accent) 0%, var(--color-gold) 50%, var(--color-accent) 100%)',
      }}
    />
  );
}
