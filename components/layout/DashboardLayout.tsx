'use client';

import { type ReactNode } from 'react';
import Sidebar, { type SidebarMenuItem, type UserRole } from './Sidebar';
import Topbar from './Topbar';

type DashboardLayoutProps = {
  title: string;
  role: UserRole;
  children: ReactNode;
  userName?: string;
  userAvatarUrl?: string;
  menuItems?: SidebarMenuItem[];
  brandName?: string;
  logo?: ReactNode;
  onLogout?: () => void;
};

const iconClass = 'h-5 w-5';

const defaultMenuItems: SidebarMenuItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    href: '/super-admin',
    icon: (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 13h8V3H3zM13 21h8v-6h-8zM13 3h8v8h-8zM3 21h8v-6H3z" />
      </svg>
    ),
  },
  {
    key: 'institutes',
    label: 'Institutes',
    href: '/institute',
    roles: ['SUPER_ADMIN', 'INSTITUTE'],
    icon: (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 10h6M9 14h6" />
      </svg>
    ),
  },
  {
    key: 'students',
    label: 'Students',
    href: '/student',
    roles: ['SUPER_ADMIN', 'INSTITUTE', 'STUDENT'],
    icon: (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    key: 'exams',
    label: 'Exams',
    href: '/exams',
    roles: ['SUPER_ADMIN', 'INSTITUTE', 'STUDENT'],
    icon: (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M8 2v4M16 2v4M3 10h18" />
      </svg>
    ),
  },
];

export default function DashboardLayout({
  title,
  role,
  children,
  userName,
  userAvatarUrl,
  menuItems,
  brandName,
  logo,
  onLogout,
}: DashboardLayoutProps) {
  const avatarFallback = (userName || role).slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar
          logo={logo}
          brandName={brandName}
          role={role}
          menuItems={menuItems ?? defaultMenuItems}
          onLogout={onLogout}
        />
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar title={title} avatarUrl={userAvatarUrl} avatarFallback={avatarFallback} />
          <main className="flex-1 p-4 md:p-6">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

