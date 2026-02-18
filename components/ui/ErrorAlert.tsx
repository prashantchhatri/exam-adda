type ErrorAlertProps = {
  message: string;
  className?: string;
};

export default function ErrorAlert({ message, className = '' }: ErrorAlertProps) {
  return (
    <div
      className={`rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300 ${className}`}
      role="alert"
    >
      {message}
    </div>
  );
}
