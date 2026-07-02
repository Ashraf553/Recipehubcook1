import { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../i18n';
import { cn } from '../lib/cn';

export function LanguageSwitcher() {
  const { i18n } = useTranslation('t');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change language"
        className="flex h-9 cursor-pointer items-center gap-1.5 rounded-pill border border-[var(--color-line)] bg-[var(--color-surface)] px-3 text-sm font-medium transition-colors duration-200 hover:bg-[var(--color-bg-secondary)]"
      >
        <Globe size={15} />
        <span className="hidden sm:inline">{current.flag} {current.label}</span>
        <span className="sm:hidden">{current.flag}</span>
      </button>

      {open && (
        <div className="glass-strong absolute right-0 top-11 z-50 w-44 overflow-hidden rounded-2xl py-1 shadow-lg">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => { i18n.changeLanguage(lang.code); setOpen(false); }}
              className={cn(
                'flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--color-bg-secondary)]/60',
                i18n.language === lang.code && 'text-[var(--color-accent)] font-semibold',
              )}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
