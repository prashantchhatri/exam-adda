'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';

export type UserRole = 'SUPER_ADMIN' | 'INSTITUTE' | 'STUDENT';

export type SidebarMenuItem = {
  key: string;
  label: string;
  href: string;
  icon?: ReactNode;
  roles?: UserRole[];
};

type SidebarProps = {
  logo?: ReactNode;
  brandName?: string;
  role: UserRole;
  menuItems: SidebarMenuItem[];
  onLogout?: () => void;
};

function DefaultIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 12h18M12 3v18" />
    </svg>
  );
}

export default function Sidebar({
  logo,
  brandName = 'Exam Adda',
  role,
  menuItems,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();
  const filteredItems = menuItems.filter((item) => !item.roles || item.roles.includes(role));

  return (
    <aside className="saas-sidebar">
      <div className="saas-sidebar-brand">
        <div className="saas-sidebar-logo">
          {logo ?? 'EA'}
        </div>
        <div>
          <p className="saas-sidebar-brand-name">{brandName}</p>
          <p className="saas-sidebar-role">{role}</p>
        </div>
      </div>

      <nav className="saas-sidebar-nav">
        {filteredItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`saas-sidebar-item ${active ? 'active' : ''}`}
            >
              <span>{item.icon ?? <DefaultIcon />}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={onLogout}
          className="saas-sidebar-item danger"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
