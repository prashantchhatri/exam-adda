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

type SuperAdminDashboard = {
  counts: {
    users: number;
    institutes: number;
    students: number;
  };
  users: Array<{ id: string; email: string; role: string }>;
  institutes: Array<{ id: string; name: string; owner: { email: string } }>;
  students: Array<{ id: string; fullName: string; user: { email: string }; institute: { name: string } }>;
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

  const recentUsers = data?.users?.slice(0, 10) ?? [];

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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Card title="Total Users">
            <p className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
              {loading ? '...' : data?.counts.users ?? 0}
            </p>
          </Card>
          <Card title="Total Institutes">
            <p className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
              {loading ? '...' : data?.counts.institutes ?? 0}
            </p>
          </Card>
          <Card title="Total Students">
            <p className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
              {loading ? '...' : data?.counts.students ?? 0}
            </p>
          </Card>
        </div>

        <div className="mt-6">
          <Card title="Recent Users" subtitle="Last 10 users by latest signup">
            {loading ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading recent users...</p>
            ) : error ? (
              <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
            ) : recentUsers.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No users found.</p>
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
