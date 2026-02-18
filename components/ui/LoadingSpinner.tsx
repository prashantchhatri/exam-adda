type LoadingSpinnerProps = {
  label?: string;
  className?: string;
};

export default function LoadingSpinner({
  label = 'Loading...',
  className = '',
}: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 ${className}`}>
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700 dark:border-slate-700 dark:border-t-slate-200" />
      <span>{label}</span>
    </div>
  );
}
