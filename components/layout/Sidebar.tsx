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
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
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
    <aside className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80 lg:w-72 lg:min-h-screen lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-3 px-5 py-4 lg:px-6 lg:py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white dark:bg-slate-100 dark:text-slate-900">
          {logo ?? 'EA'}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{brandName}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{role}</p>
        </div>
      </div>

      <nav className="flex flex-row gap-2 overflow-x-auto px-3 pb-4 lg:flex-col lg:px-4">
        {filteredItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`inline-flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <span className="shrink-0">{item.icon ?? <DefaultIcon />}</span>
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
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
