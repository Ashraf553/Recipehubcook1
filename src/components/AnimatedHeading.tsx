import { createElement } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { easeOut } from '../lib/motion';
import { cn } from '../lib/cn';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
  /** A word/phrase within `text` to render in serif italic (the editorial accent). */
  accent?: string;
  /** Heading level for semantics/SEO. */
  as?: 'h1' | 'h2' | 'h3';
  delay?: number;
}

/**
 * Display heading that assembles itself word by word, each word rising out
 * from a clipping mask. An optional `accent` phrase is set in italic.
 * Collapses to a plain heading under prefers-reduced-motion.
 */
export function AnimatedHeading({
  text,
  className,
  accent,
  as = 'h2',
  delay = 0,
}: AnimatedHeadingProps) {
  const reduce = useReducedMotion();
  const accentWords = accent ? accent.split(' ') : [];
  const words = text.split(' ');

  const isAccent = (w: string) => accentWords.includes(w);

  if (reduce) {
    return createElement(
      as,
      { className },
      words.map((w, i) =>
        createElement(
          'span',
          { key: i, className: isAccent(w) ? 'italic text-[var(--color-accent)]' : undefined },
          i === words.length - 1 ? w : `${w} `,
        ),
      ),
    );
  }

  const MotionTag = motion[as] as typeof motion.h2;

  return (
    <MotionTag
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: delay } } }}
    >
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cn(
            'inline-block overflow-hidden align-bottom pb-[0.12em]',
            i !== words.length - 1 && 'mr-[0.25em]',
          )}
        >
          <motion.span
            className={cn('inline-block', isAccent(w) && 'italic text-[var(--color-accent)]')}
            variants={{
              hidden: { y: '115%', opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { duration: 0.75, ease: easeOut } },
            }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
