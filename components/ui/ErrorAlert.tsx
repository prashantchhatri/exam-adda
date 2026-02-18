type ErrorAlertProps = {
  message: string;
  className?: string;
};

export default function ErrorAlert({ message, className = '' }: ErrorAlertProps) {
  return (
    <div className={`saas-error ${className}`} role="alert">
      {message}
    </div>
  );
}
