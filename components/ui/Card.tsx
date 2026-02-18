import { type ReactNode } from 'react';

type CardProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
};

export default function Card({ title, subtitle, children, className = '', actions }: CardProps) {
  return (
    <section className={`saas-card ${className}`}>
      {(title || subtitle || actions) ? (
        <header className="saas-card-header">
          <div>
            {title ? <h3 className="saas-card-title">{title}</h3> : null}
            {subtitle ? <p className="saas-card-subtitle">{subtitle}</p> : null}
          </div>
          {actions}
        </header>
      ) : null}
      <div>{children}</div>
    </section>
  );
}
