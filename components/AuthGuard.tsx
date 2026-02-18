'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { dashboardPathByRole, getCurrentUser, getToken, SessionUser } from '@/lib/auth';

export default function AuthGuard({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: SessionUser['role'][];
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    const user = getCurrentUser();
    if (!token) {
      if (roles?.includes('SUPER_ADMIN')) {
        router.replace('/admin/login');
      } else {
        router.replace('/');
      }
      return;
    }
    if (roles && roles.length > 0 && (!user?.role || !roles.includes(user.role))) {
      router.replace(dashboardPathByRole(user?.role));
      return;
    }
    setReady(true);
  }, [router, roles]);

  if (!ready) return null;
  return <>{children}</>;
}
