'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import { getSuperAdminDashboard } from '@/services/dashboard.service';
import { clearSession, getCurrentUser } from '@/lib/auth';
import { logout } from '@/services/auth.service';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Table, { TableColumn } from '@/components/ui/Table';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import ErrorAlert from '@/components/ui/ErrorAlert';

type SuperAdminDashboard = {
  stats?: {
    totalUsers?: number;
    totalInstitutes?: number;
    totalStudents?: number;
  };
  recentUsers?: Array<{ id: string; email: string; role: string }>;
  recentInstitutes?: Array<{ id: string; name: string }>;
};

export default function SuperAdminPage() {
  const router = useRouter();
  const [data, setData] = useState<SuperAdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = getCurrentUser();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await getSuperAdminDashboard();
        setData(response.data as SuperAdminDashboard);
      } catch {
        setError('Failed to load super admin dashboard.');
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
      // ignore; client session clear is enough
    }
    clearSession();
    router.push('/admin/login');
  };

  const recentUsers = data?.recentUsers ?? [];
  const hasStats = !!data?.stats;

  const userColumns: TableColumn<{ id: string; email: string; role: string }>[] = [
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
  ];

  return (
    <AuthGuard roles={['SUPER_ADMIN']}>
      <DashboardLayout
        title="Super Admin Dashboard"
        role="SUPER_ADMIN"
        userName={user?.email}
        onLogout={onLogout}
      >
        <div className="saas-stats-grid">
          <Card title="Total Users">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <p className="saas-stat-value">
                {data?.stats?.totalUsers ?? 0}
              </p>
            )}
          </Card>
          <Card title="Total Institutes">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <p className="saas-stat-value">
                {data?.stats?.totalInstitutes ?? 0}
              </p>
            )}
          </Card>
          <Card title="Total Students">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <p className="saas-stat-value">
                {data?.stats?.totalStudents ?? 0}
              </p>
            )}
          </Card>
        </div>

        <div className="saas-section-gap">
          {!loading && !error && !hasStats ? (
            <ErrorAlert message="Dashboard response is missing stats payload." className="mb-4" />
          ) : null}
          <Card title="Recent Users" subtitle="Last 10 users by latest signup">
            {loading ? (
              <LoadingSpinner label="Loading recent users..." />
            ) : error ? (
              <ErrorAlert message={error} />
            ) : recentUsers.length === 0 ? (
              <EmptyState title="No users found." description="New users will appear here." />
            ) : (
              <Table
                columns={userColumns}
                data={recentUsers}
                rowKey="id"
                emptyText="No users found."
              />
            )}
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
