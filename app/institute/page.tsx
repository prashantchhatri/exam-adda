'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { getInstituteDashboard } from '@/services/dashboard.service';
import { updateMyInstituteDetails } from '@/services/institute.service';

type InstituteDashboard = {
  institute: {
    id: string;
    name: string;
    slug?: string | null;
    description?: string | null;
    logoUrl?: string | null;
    address?: string | null;
    phone?: string | null;
    showInfoOnLogin?: boolean;
    students: Array<{
      id: string;
      fullName: string;
      user: { email: string };
    }>;
  };
  counts: { students: number };
};

export default function InstitutePage() {
  const [data, setData] = useState<InstituteDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [showInfoOnLogin, setShowInfoOnLogin] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const instituteSlug = (data?.institute?.slug || data?.institute?.name || '')
    .toLowerCase()
    .replace(/[\s_-]+/g, '')
    .replace(/[^a-z0-9]/g, '');
  const instituteLoginUrl =
    typeof window !== 'undefined' && instituteSlug
      ? `${window.location.origin}/login/${instituteSlug}`
      : '';

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getInstituteDashboard();
        setData(response.data as InstituteDashboard);
        const loaded = (response.data as InstituteDashboard).institute;
        setLogoUrl(loaded.logoUrl || '');
        setAddress(loaded.address || '');
        setPhone(loaded.phone || '');
        setShowInfoOnLogin(!!loaded.showInfoOnLogin);
      } catch {
        setError('Failed to load institute dashboard.');
      }
    };
    load();
  }, []);

  const onCopyLink = async () => {
    if (!instituteLoginUrl) return;
    await navigator.clipboard.writeText(instituteLoginUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const onSaveInstituteDetails = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingDetails(true);
    setSaveMessage(null);
    try {
      const response = await updateMyInstituteDetails({
        logoUrl: logoUrl || undefined,
        address: address || undefined,
        phone: phone || undefined,
        showInfoOnLogin,
      });
      setData((prev) =>
        prev
          ? {
              ...prev,
              institute: {
                ...prev.institute,
                logoUrl: response.data.logoUrl,
                address: response.data.address,
                phone: response.data.phone,
                showInfoOnLogin: response.data.showInfoOnLogin,
              },
            }
          : prev,
      );
      setSaveMessage('Institute details updated.');
    } catch {
      setSaveMessage('Failed to update institute details.');
    } finally {
      setSavingDetails(false);
    }
  };

  return (
    <AuthGuard roles={['INSTITUTE']}>
      <section className="panel">
        <p className="kicker">Institute Dashboard</p>
        <h1>{data?.institute?.name || 'Institute'}</h1>
        <p className="subtext">{data?.institute?.description || 'No description available.'}</p>

        <div className="grid-3" style={{ marginTop: 16 }}>
          <div className="metric">
            <h3>{data?.counts.students ?? 0}</h3>
            <p>Total Students</p>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <p className="subtext" style={{ marginBottom: 8 }}>
            Institute Login URL
          </p>
          <div className="copy-row">
            <input className="copy-input" value={instituteLoginUrl} readOnly />
            <button type="button" className="btn ghost" onClick={onCopyLink}>
              {copied ? 'Copied' : 'Copy Link'}
            </button>
          </div>
        </div>

        <form className="form" style={{ marginTop: 22 }} onSubmit={onSaveInstituteDetails}>
          <h2>Add institute details</h2>
          <p className="subtext">Logo is always visible on login. Phone and address are optional.</p>
          <label className="field">
            Logo URL
            <input
              type="url"
              placeholder="https://example.com/logo.png"
              value={logoUrl}
              onChange={(event) => setLogoUrl(event.target.value)}
            />
          </label>
          <label className="field">
            Phone Number (optional)
            <input
              type="tel"
              placeholder="9876543210"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </label>
          <label className="field">
            Address (optional)
            <input
              type="text"
              placeholder="City, Area"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </label>
          <label className="field field-inline">
            <span>Show phone + address on login page</span>
            <input
              type="checkbox"
              checked={showInfoOnLogin}
              onChange={(event) => setShowInfoOnLogin(event.target.checked)}
            />
          </label>
          <button type="submit" className="btn primary" disabled={savingDetails}>
            {savingDetails ? 'Saving...' : 'Save details'}
          </button>
          {saveMessage ? <p className={saveMessage.includes('Failed') ? 'error' : 'subtext'}>{saveMessage}</p> : null}
        </form>

        {error && <p className="error" style={{ marginTop: 16 }}>{error}</p>}

        <h2 style={{ marginTop: 28 }}>Students</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {(data?.institute?.students || []).map((student) => (
              <tr key={student.id}>
                <td>{student.fullName}</td>
                <td>{student.user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AuthGuard>
  );
}
