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
    <header className="saas-topbar">
      <div>
        <h1 className="saas-topbar-title">{title}</h1>
        {subtitle ? <p className="saas-topbar-subtitle">{subtitle}</p> : null}
      </div>

      <div className="saas-topbar-right">
        {rightSlot}
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="User avatar" className="saas-avatar" />
        ) : (
          <div className="saas-avatar-fallback">
            {avatarFallback}
          </div>
        )}
      </div>
    </header>
  );
}
