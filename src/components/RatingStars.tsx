import { Star } from 'lucide-react';
import { cn } from '../lib/cn';

interface RatingStarsProps {
  rating: number;
  className?: string;
}

export function RatingStars({ rating, className }: RatingStarsProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-1', className)}
      aria-label={`Рейтинг ${rating} из 5`}
    >
      <Star
        size={14}
        className="fill-[var(--color-accent)] text-[var(--color-accent)]"
        aria-hidden="true"
      />
      <span className="text-xs font-semibold">{rating.toFixed(1)}</span>
    </span>
  );
}
