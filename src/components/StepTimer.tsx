import { Play, Pause, RotateCcw } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown';

interface StepTimerProps {
  minutes: number;
}

export function StepTimer({ minutes }: StepTimerProps) {
  const { label, isRunning, done, start, pause, reset } = useCountdown(minutes * 60);

  return (
    <div className="glass mt-2 inline-flex items-center gap-2 rounded-pill px-3 py-1.5 text-sm">
      <span className={done ? 'font-semibold text-[var(--color-accent)]' : 'tabular-nums'}>
        {done ? 'Готово!' : label}
      </span>
      <button
        type="button"
        onClick={isRunning ? pause : start}
        aria-label={isRunning ? 'Пауза' : 'Старт таймера'}
        className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent)] text-white"
      >
        {isRunning ? <Pause size={12} /> : <Play size={12} />}
      </button>
      <button
        type="button"
        onClick={reset}
        aria-label="Сбросить таймер"
        className="flex h-6 w-6 items-center justify-center rounded-full text-[var(--color-text-secondary)]"
      >
        <RotateCcw size={12} />
      </button>
    </div>
  );
}
