import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/useAuthStore';
import { AuthShell } from '../components/AuthShell';

export default function Register() {
  const { t } = useTranslation('t');
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim() || !confirm.trim()) {
      setError(t('auth.errors.fill_all'));
      return;
    }
    if (password !== confirm) {
      setError(t('auth.errors.passwords_mismatch'));
      return;
    }
    const result = register(username.trim(), email.trim(), password);
    if (result.ok) {
      navigate('/');
    } else {
      setError(t(`auth.errors.${result.error}` as never));
    }
  };

  const field =
    'rounded-glass-sm border border-[var(--color-line)] bg-[var(--color-bg-secondary)] px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-accent)]';

  return (
    <AuthShell title={t('auth.create_account')} subtitle={t('auth.register')}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="username" className="text-sm font-medium">
            {t('auth.username')}
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t('auth.username_placeholder')}
            className={field}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="r-email" className="text-sm font-medium">
            {t('auth.email')}
          </label>
          <input
            id="r-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.email_placeholder')}
            className={field}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="r-pass" className="text-sm font-medium">
              {t('auth.password')}
            </label>
            <input
              id="r-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={field}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="r-confirm" className="text-sm font-medium">
              {t('auth.confirm_password')}
            </label>
            <input
              id="r-confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              className={field}
            />
          </div>
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
          {t('auth.register')}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
        {t('auth.have_account')}{' '}
        <Link to="/login" className="cursor-pointer font-medium text-[var(--color-accent)] hover:underline">
          {t('auth.login')}
        </Link>
      </p>
    </AuthShell>
  );
}
