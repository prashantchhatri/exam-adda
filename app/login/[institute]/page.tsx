'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { clearSession, dashboardPathByRole, getCurrentUser, getToken, setSession } from '@/lib/auth';
import { loginForInstitute } from '@/services/auth.service';
import { getInstituteBySlug, InstituteLoginInfo } from '@/services/institute.service';

const normalizeInstituteSlug = (value: string) =>
  value.toLowerCase().replace(/[\s_\-]+/g, '').replace(/[^a-z0-9]/g, '');

export default function InstituteLoginPage() {
  const params = useParams<{ institute: string }>();
  const router = useRouter();
  const [institute, setInstitute] = useState<InstituteLoginInfo | null>(null);
  const [loadingInstitute, setLoadingInstitute] = useState(true);
  const [invalidInstitute, setInvalidInstitute] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestedSlug = normalizeInstituteSlug(params.institute || '');

  useEffect(() => {
    const token = getToken();
    const user = getCurrentUser();
    if (token && user) {
      router.replace(dashboardPathByRole(user.role));
      return;
    }
  }, [router]);

  useEffect(() => {
    if (!requestedSlug) {
      setLoadingInstitute(false);
      setInvalidInstitute(true);
      return;
    }

    const load = async () => {
      setLoadingInstitute(true);
      setInvalidInstitute(false);
      setInstitute(null);
      try {
        const response = await getInstituteBySlug(requestedSlug);
        setInstitute(response.data);
      } catch {
        setInvalidInstitute(true);
      } finally {
        setLoadingInstitute(false);
      }
    };
    load();
  }, [requestedSlug]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const auth = await loginForInstitute(requestedSlug, { email, password });

      setSession(auth.accessToken, auth.user);
      router.push(dashboardPathByRole(auth.user.role));
    } catch {
      clearSession();
      setError('Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-wrap">
      <div className="auth-card">
        <p className="kicker">Institute Login</p>
        <h1>{institute?.name || 'Institute Portal'}</h1>
        <p className="subtext">Sign in with institute owner or student account.</p>

        {institute?.logoUrl ? (
          <div className="institute-brand">
            <img src={institute.logoUrl} alt={`${institute.name} logo`} />
            <div>
              <p className="label">Institute</p>
              <p>{institute.name}</p>
              {institute.phone ? <p className="subtext">Phone: {institute.phone}</p> : null}
              {institute.address ? <p className="subtext">Address: {institute.address}</p> : null}
            </div>
          </div>
        ) : null}

        {loadingInstitute && <p className="subtext">Loading institute details...</p>}

        {invalidInstitute && (
          <p className="error">Invalid institute login URL.</p>
        )}

        <form onSubmit={onSubmit} className="form">
          <label className="field">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="field">
            Password
            <div className="password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
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
          <button className="btn primary" type="submit" disabled={loading || loadingInstitute || invalidInstitute}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </section>
  );
}
