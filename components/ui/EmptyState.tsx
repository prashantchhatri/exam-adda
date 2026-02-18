import { type ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
};

export default function EmptyState({
  title,
  description,
  icon,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-xl border border-dashed border-slate-300 bg-slate-50/80 p-6 text-center dark:border-slate-700 dark:bg-slate-800/30 ${className}`}
    >
      {icon ? <div className="mb-3 flex justify-center text-slate-400 dark:text-slate-500">{icon}</div> : null}
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</p>
      {description ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
    </div>
  );
}
