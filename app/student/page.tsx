'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import { getStudentDashboard } from '@/services/dashboard.service';
import { clearSession, getCurrentUser } from '@/lib/auth';
import { logout } from '@/services/auth.service';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';

type StudentDashboard = {
  id: string;
  fullName: string;
  user: { email: string };
  institute: {
    id: string;
    name: string;
    description?: string | null;
    address?: string | null;
    phone?: string | null;
  };
};

export default function StudentPage() {
  const router = useRouter();
  const user = getCurrentUser();
  const [data, setData] = useState<StudentDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await getStudentDashboard();
        setData(response.data as StudentDashboard);
      } catch {
        setError('Failed to load student dashboard.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const onLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore
    }
    clearSession();
    router.push('/');
  };

  return (
    <AuthGuard roles={['STUDENT']}>
      <DashboardLayout
        title="Student Dashboard"
        role="STUDENT"
        userName={user?.email}
        onLogout={onLogout}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Profile">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {loading ? 'Loading...' : data?.fullName || 'Student'}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {data?.user.email || 'No email'}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Academic progress and exams will appear here.
              </p>
            </div>
          </Card>

          <Card title="Institute Info">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {data?.institute?.name || 'N/A'}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {data?.institute?.description || 'No institute description.'}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {data?.institute?.address || 'Address not available'}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {data?.institute?.phone || 'Phone not available'}
              </p>
            </div>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card title="Available Exams" subtitle="Upcoming and open exams">
            {loading ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading...</p>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No available exams yet.
              </p>
            )}
          </Card>
          <Card title="Attempted Exams" subtitle="Your completed exam history">
            {loading ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading...</p>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No attempted exams yet.
              </p>
            )}
          </Card>
        </div>

        {error ? (
          <p className="mt-4 text-sm text-rose-600 dark:text-rose-400">{error}</p>
        ) : null}
      </DashboardLayout>
    </AuthGuard>
  );
}
