'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { getStudentDashboard } from '@/services/dashboard.service';

type StudentDashboard = {
  id: string;
  fullName: string;
  user: { email: string };
  institute: { id: string; name: string; description?: string | null };
};

export default function StudentPage() {
  const [data, setData] = useState<StudentDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getStudentDashboard();
        setData(response.data as StudentDashboard);
      } catch {
        setError('Failed to load student dashboard.');
      }
    };
    load();
  }, []);

  return (
    <AuthGuard roles={['STUDENT']}>
      <section className="panel">
        <p className="kicker">Student Dashboard</p>
        <h1>{data?.fullName || 'Student'}</h1>
        <p className="subtext">{data?.user?.email || ''}</p>

        <div className="hero-card" style={{ marginTop: 20 }}>
          <h2>Institute</h2>
          <p className="subtext">{data?.institute?.name || 'N/A'}</p>
          <p className="subtext">{data?.institute?.description || 'No institute description.'}</p>
        </div>

        {error && <p className="error" style={{ marginTop: 16 }}>{error}</p>}
      </section>
    </AuthGuard>
  );
}
