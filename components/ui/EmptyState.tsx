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
    <div className={`saas-empty ${className}`}>
      {icon ? <div className="saas-empty-icon">{icon}</div> : null}
      <p className="saas-empty-title">{title}</p>
      {description ? <p className="saas-empty-description">{description}</p> : null}
    </div>
  );
}
