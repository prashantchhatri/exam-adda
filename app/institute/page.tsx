'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { createInstitute, getMyInstitute, Institute } from '@/services/institute.service';

export default function InstitutePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [institute, setInstitute] = useState<Institute | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getMyInstitute();
        setInstitute(data);
      } catch {
        setInstitute(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const { data } = await createInstitute({ name, description });
      setInstitute(data);
    } catch (err: unknown) {
      setError('Unable to create institute.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthGuard>
      <section className="panel">
        <div className="dash-header">
          <div>
            <p className="kicker">Institute Console</p>
            <h1>Your institute space</h1>
            <p className="subtext">Set up once and start onboarding students.</p>
          </div>
          <div className="chip">Active</div>
        </div>

        {loading ? (
          <p className="subtext">Loading...</p>
        ) : institute ? (
          <div className="hero-card" style={{ marginTop: 16 }}>
            <h2>{institute.name}</h2>
            <p className="subtext">{institute.description || 'No description yet.'}</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="form" style={{ marginTop: 16 }}>
            <label className="field">
              Institute Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label className="field">
              Description
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            {error && <p className="error">{error}</p>}
            <button className="btn primary" type="submit" disabled={saving}>
              {saving ? 'Creating...' : 'Create Institute'}
            </button>
          </form>
        )}
      </section>
    </AuthGuard>
  );
}
