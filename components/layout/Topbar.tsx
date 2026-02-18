import { type ReactNode } from 'react';

type TopbarProps = {
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  avatarFallback?: string;
  rightSlot?: ReactNode;
};

export default function Topbar({
  title,
  subtitle,
  avatarUrl,
  avatarFallback = 'U',
  rightSlot,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/70 px-4 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/70 md:px-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100 md:text-xl">{title}</h1>
        {subtitle ? <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
      </div>

      <div className="flex items-center gap-3">
        {rightSlot}
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="User avatar" className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
            {avatarFallback}
          </div>
        )}
      </div>
    </header>
  );
}
