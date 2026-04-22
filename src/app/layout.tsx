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
          <div className="container nav-content-top">
            <div className="brand-area">
              <div className="brand">UAE Grocery Deals</div>
            </div>
            
            <div className="location-picker">
              <div className="location-icon">📍</div>
              <div className="location-info">
                <span className="location-time">Today 4:30 PM</span>
                <span className="location-name">Dubai Festival City v</span>
              </div>
            </div>

            <div className="search-bar">
              <input type="text" placeholder="Search 50,000+ items" />
              <button className="search-btn">🔍</button>
            </div>

            <div className="user-actions">
              <div className="country-flag">🇦🇪</div>
              <div className="auth-links">
                <span>👤 Login & Register</span>
              </div>
              <div className="cart-icon">
                🛒 <span className="cart-count">0</span>
              </div>
            </div>
          </div>
          
          <div className="container nav-content-bottom">
            <nav className="nav-links">
              <a href="/" className="active">All Categories</a>
              <a href="/">Fresh Food</a>
              <a href="/">Fruits & Veg</a>
              <a href="/">Food Cupboard</a>
              <a href="/">Beverages</a>
              <a href="/">Baby Products</a>
              <a href="/">Admin access</a>
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
