'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { setToken } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/register', { email, password, role });
      setToken(data?.accessToken);
      const next = role === 'INSTITUTE' ? '/institute' : '/protected';
      router.push(next);
    } catch (err: unknown) {
      setError('Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-wrap">
      <div className="auth-card">
        <p className="kicker">New Here?</p>
        <h1>Create your Exam Adda account</h1>
        <p className="subtext">Choose your role and get started in minutes.</p>
        <form onSubmit={onSubmit} className="form">
          <label className="field">
            Email
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="field">
            Password
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <label className="field">
            Role
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="STUDENT">Student</option>
              <option value="INSTITUTE">Institute</option>
            </select>
          </label>
          {error && <p className="error">{error}</p>}
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>
      </div>
    </section>
  );
}
