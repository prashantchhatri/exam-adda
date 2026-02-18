type LoadingSpinnerProps = {
  label?: string;
  className?: string;
};

export default function LoadingSpinner({
  label = 'Loading...',
  className = '',
}: LoadingSpinnerProps) {
  return (
    <div className={`saas-loading ${className}`}>
      <span className="saas-loading-spinner" />
      <span>{label}</span>
    </div>
  );
}
