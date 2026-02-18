'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { clearSession, dashboardPathByRole, getCurrentUser, SessionUser } from '@/lib/auth';
import { logout } from '@/services/auth.service';

export default function HeaderNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);
  const isDashboardRoute =
    pathname === '/super-admin' || pathname === '/institute' || pathname === '/student';

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const onLogout = async () => {
    try {
      await logout();
    } catch {
      // Client session clear is enough for JWT logout.
    }
    clearSession();
    setUser(null);
    router.push('/');
  };

  if (!user && isDashboardRoute) {
    return null;
  }

  if (!user) {
    return (
      <nav className="nav-links">
        <Link className="pill" href="/register">Register</Link>
      </nav>
    );
  }

  if (isDashboardRoute) {
    return (
      <nav className="nav-links">
        <button className="pill btn-inline" type="button" onClick={onLogout}>
          Logout
        </button>
      </nav>
    );
  }

  return (
    <nav className="nav-links">
      <Link href={dashboardPathByRole(user.role)}>Dashboard</Link>
      <button className="pill btn-inline" type="button" onClick={onLogout}>
        Logout
      </button>
    </nav>
  );
}
