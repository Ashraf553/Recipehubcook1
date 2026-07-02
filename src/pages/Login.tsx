import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/useAuthStore';
import { AuthShell } from '../components/AuthShell';

export default function Login() {
  const { t } = useTranslation('t');
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError(t('auth.errors.fill_all'));
      return;
    }
    const result = login(email.trim(), password);
    if (result.ok) {
      navigate('/');
    } else {
      setError(t(`auth.errors.${result.error}` as never));
    }
  };

  const field =
    'rounded-glass-sm border border-[var(--color-line)] bg-[var(--color-bg-secondary)] px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-accent)]';

  return (
    <AuthShell title={t('auth.welcome_back')} subtitle={t('auth.sign_in')}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            {t('auth.email')}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.email_placeholder')}
            className={field}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            {t('auth.password')}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={field}
          />
        </div>

        {error && (
          <p className="rounded-glass-sm bg-[var(--color-accent)]/10 px-3 py-2 text-sm text-[var(--color-accent)]">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="mt-1 cursor-pointer rounded-pill bg-[var(--color-accent)] py-3 text-sm font-semibold text-[var(--color-accent-contrast)] transition-colors duration-200 hover:bg-[var(--color-text)]"
        >
          {t('auth.login')}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
        {t('auth.no_account')}{' '}
        <Link
          to="/register"
          className="cursor-pointer font-medium text-[var(--color-accent)] hover:underline"
        >
          {t('auth.register')}
        </Link>
      </p>
    </AuthShell>
  );
}
