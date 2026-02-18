'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import { getStudentDashboard } from '@/services/dashboard.service';
import { clearSession, getCurrentUser } from '@/lib/auth';
import { logout } from '@/services/auth.service';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import ErrorAlert from '@/components/ui/ErrorAlert';

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
            {loading ? (
              <LoadingSpinner label="Loading profile..." />
            ) : (
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {data?.fullName || 'Student'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {data?.user.email || 'No email'}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Academic progress and exams will appear here.
                </p>
              </div>
            )}
          </Card>

          <Card title="Institute Info">
            {loading ? (
              <LoadingSpinner label="Loading institute..." />
            ) : (
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
            )}
          </Card>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card title="Available Exams" subtitle="Upcoming and open exams">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <EmptyState title="No available exams yet." description="Your institute has not published exams yet." />
            )}
          </Card>
          <Card title="Attempted Exams" subtitle="Your completed exam history">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <EmptyState title="No attempted exams yet." description="Your attempted exam history will appear here." />
            )}
          </Card>
        </div>

        {error ? <ErrorAlert message={error} className="mt-4" /> : null}
      </DashboardLayout>
    </AuthGuard>
  );
}
