'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { getSuperAdminDashboard } from '@/services/dashboard.service';

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
  const [data, setData] = useState<SuperAdminDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getSuperAdminDashboard();
        setData(response.data as SuperAdminDashboard);
      } catch {
        setError('Failed to load super admin dashboard.');
      }
    };
    load();
  }, []);

  return (
    <AuthGuard roles={['SUPER_ADMIN']}>
      <section className="panel">
        <p className="kicker">Super Admin</p>
        <h1>System Dashboard</h1>
        <p className="subtext">All records across users, institutes, and students.</p>

        <div className="grid-3" style={{ marginTop: 16 }}>
          <div className="metric">
            <h3>{data?.counts.users ?? 0}</h3>
            <p>Total Users</p>
          </div>
          <div className="metric">
            <h3>{data?.counts.institutes ?? 0}</h3>
            <p>Total Institutes</p>
          </div>
          <div className="metric">
            <h3>{data?.counts.students ?? 0}</h3>
            <p>Total Students</p>
          </div>
        </div>

        {error && <p className="error" style={{ marginTop: 16 }}>{error}</p>}

        <h2 style={{ marginTop: 28 }}>Users</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {(data?.users || []).map((item) => (
              <tr key={item.id}>
                <td>{item.email}</td>
                <td>{item.role}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={{ marginTop: 28 }}>Institutes</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Owner</th>
            </tr>
          </thead>
          <tbody>
            {(data?.institutes || []).map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.owner.email}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={{ marginTop: 28 }}>Students</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Institute</th>
            </tr>
          </thead>
          <tbody>
            {(data?.students || []).map((item) => (
              <tr key={item.id}>
                <td>{item.fullName}</td>
                <td>{item.user.email}</td>
                <td>{item.institute.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AuthGuard>
  );
}
