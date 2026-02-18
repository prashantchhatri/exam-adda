'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearSession, dashboardPathByRole, getCurrentUser, getToken, SessionUser } from '@/lib/auth';

export default function AuthGuard({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: SessionUser['role'][];
}) {
  const router = useRouter();
  const [validating, setValidating] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    const user = getCurrentUser();

    if (!token) {
      setReady(false);
      setValidating(false);
      if (roles?.includes('SUPER_ADMIN')) {
        router.replace('/admin/login');
      } else {
        router.replace('/');
      }
      return;
    }

    if (token && !user) {
      clearSession();
      setReady(false);
      setValidating(false);
      router.replace('/');
      return;
    }

    if (roles && roles.length > 0 && user && !roles.includes(user.role)) {
      setReady(false);
      setValidating(false);
      router.replace(dashboardPathByRole(user.role));
      return;
    }

    setReady(true);
    setValidating(false);
  }, [router, roles]);

  if (validating || !ready) {
    return (
      <div className="auth-wrap">
        <div className="auth-card">
          <p className="subtext">Validating session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
