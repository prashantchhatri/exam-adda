import './globals.css';
import type { Metadata } from 'next';
import { Sora, DM_Sans } from 'next/font/google';

const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm' });

export const metadata: Metadata = {
  title: 'Exam Adda',
  description: 'Exam Adda platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${dmSans.variable}`}>
      <body>
        <div className="app-shell">
          <header className="app-header">
            <div className="brand">
              <span className="brand-mark">EA</span>
              <div className="brand-text">
                <span>Exam Adda</span>
                <small>EdTech Platform</small>
              </div>
            </div>
            <nav className="nav-links">
              <a href="/auth/login">Login</a>
              <a className="pill" href="/auth/register">Register</a>
            </nav>
          </header>
          <main className="app-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
