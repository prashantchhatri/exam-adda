'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <section className="panel">
        <h1>Protected Area</h1>
        <p className="subtext">You are authenticated and can access this page.</p>
      </section>
    </ProtectedRoute>
  );
}
