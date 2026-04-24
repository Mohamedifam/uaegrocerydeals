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
        {children}
      </body>
    </html>
  );
}
