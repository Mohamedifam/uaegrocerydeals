import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UAE Grocery Weekly Deals',
  description: 'Find the best grocery deals across the UAE every week.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="glass-header">
          <div className="container nav-content">
            <div className="brand">UAE Grocery Deals</div>
            <nav className="nav-links">
              <a href="/">Home</a>
              <a href="/deals">All Deals</a>
              <a href="/admin">Admin access</a>
            </nav>
          </div>
        </div>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
