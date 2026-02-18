'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { dashboardPathByRole, getCurrentUser, getToken, setSession } from '@/lib/auth';
import { login } from '@/services/auth.service';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    const user = getCurrentUser();
    if (token && user) {
      router.replace(dashboardPathByRole(user.role));
    }
  }, [router]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const auth = await login({ email, password });
      if (auth?.user?.role !== 'SUPER_ADMIN') {
        setError('Only super admin can login here.');
        return;
      }
      setSession(auth?.accessToken, auth?.user);
      router.push('/super-admin');
    } catch {
      setError('Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-wrap">
      <div className="auth-card">
        <p className="kicker">Admin Portal</p>
        <h1>Super Admin Login</h1>
        <p className="subtext">Login only for platform super admin.</p>
        <form onSubmit={onSubmit} className="form">
          <label className="field">
            Email
            <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="field">
            Password
            <div className="password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
                  <circle cx="12" cy="12" r="3" />
                  {showPassword ? <line x1="3" y1="21" x2="21" y2="3" /> : null}
                </svg>
              </button>
            </div>
          </label>
          {error && <p className="error">{error}</p>}
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </section>
  );
}
