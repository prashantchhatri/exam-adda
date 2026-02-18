'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import { getInstituteDashboard } from '@/services/dashboard.service';
import { clearSession, getCurrentUser } from '@/lib/auth';
import { logout } from '@/services/auth.service';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Table, { TableColumn } from '@/components/ui/Table';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import ErrorAlert from '@/components/ui/ErrorAlert';

type InstituteDashboard = {
  institute?: {
    id: string;
    name: string;
    slug?: string | null;
    description?: string | null;
    logoUrl?: string | null;
    address?: string | null;
    phone?: string | null;
    showInfoOnLogin?: boolean;
  };
  stats?: {
    totalStudents?: number;
    activeExams?: number;
  };
  students?: Array<{
    id: string;
    fullName: string;
    user: { email: string };
  }>;
};

export default function InstitutePage() {
  const router = useRouter();
  const user = getCurrentUser();
  const [data, setData] = useState<InstituteDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await getInstituteDashboard();
        setData(response.data as InstituteDashboard);
      } catch {
        setError('Failed to load institute dashboard.');
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
      // ignore; client clear is enough
    }
    clearSession();
    router.push('/');
  };

  const students = data?.students ?? [];
  const institute = data?.institute;
  const stats = data?.stats;

  const columns: TableColumn<{ id: string; fullName: string; user: { email: string } }>[] = [
    { key: 'fullName', header: 'Name' },
    { key: 'email', header: 'Email', render: (row) => row.user.email },
  ];

  return (
    <AuthGuard roles={['INSTITUTE']}>
      <DashboardLayout
        title="Institute Dashboard"
        role="INSTITUTE"
        userName={user?.email}
        onLogout={onLogout}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Institute Info">
            {loading ? (
              <LoadingSpinner label="Loading institute details..." />
            ) : (
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {institute?.name || 'Institute'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {institute?.description || 'No description available.'}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {institute?.address || 'Address not added'}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {institute?.phone || 'Phone not added'}
                </p>
              </div>
            )}
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card title="Total Students">
              {loading ? (
                <LoadingSpinner />
              ) : (
                <p className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
                  {stats?.totalStudents ?? 0}
                </p>
              )}
            </Card>
            <Card title="Active Exams">
              <p className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{stats?.activeExams ?? 0}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Placeholder</p>
            </Card>
          </div>
        </div>

        <div className="mt-6">
          <Card title="Students" subtitle="All students in this institute">
            {loading ? (
              <LoadingSpinner label="Loading students..." />
            ) : error ? (
              <ErrorAlert message={error} />
            ) : students.length === 0 ? (
              <EmptyState title="No students found." description="Add students to see them here." />
            ) : (
              <Table
                columns={columns}
                data={students}
                rowKey="id"
                emptyText="No students found."
              />
            )}
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
