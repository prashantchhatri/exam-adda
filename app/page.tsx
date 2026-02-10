import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="kicker">EdTech Suite</p>
        <h1>Launch cohorts, track progress, and build outcomes.</h1>
        <p className="subtext">
          Exam Adda helps institutes deliver structured prep with role-based access,
          smart onboarding, and a clean student journey from enrollment to results.
        </p>
        <div className="hero-actions">
          <Link className="btn primary" href="/auth/login">Login</Link>
          <Link className="btn ghost" href="/auth/register">Create account</Link>
        </div>
        <div className="signal-row">
          <div className="signal">Cohorts</div>
          <div className="signal">Assessments</div>
          <div className="signal">Analytics</div>
        </div>
      </div>

      <div className="hero-panel">
        <div className="stat-card">
          <div>
            <p className="label">Institute Console</p>
            <h3>Batch + Course Setup</h3>
            <p className="subtext">One account, one institute.</p>
          </div>
          <div className="chip">Live</div>
        </div>
        <div className="stat-card accent">
          <div>
            <p className="label">Student Workspace</p>
            <h3>Prep + Practice</h3>
            <p className="subtext">Assignments and mock tests.</p>
          </div>
          <div className="chip">Study</div>
        </div>
        <div className="stat-card">
          <div>
            <p className="label">Security</p>
            <h3>JWT + Roles</h3>
            <p className="subtext">Secure access for every role.</p>
          </div>
          <div className="chip">Secure</div>
        </div>
      </div>
    </section>
  );
}
