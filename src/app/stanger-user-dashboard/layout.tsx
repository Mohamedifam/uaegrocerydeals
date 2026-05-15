import Link from 'next/link';
import styles from './admin.module.css';
import { Store, ShoppingCart, Tag, LayoutDashboard, FileText, Settings } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>Deals Admin</div>
        <nav>
          <Link href="/stanger-user-dashboard" className={styles.navLink}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/stanger-user-dashboard/stores" className={styles.navLink}>
            <Store size={20} />
            Stores
          </Link>
          <Link href="/stanger-user-dashboard/products" className={styles.navLink}>
            <ShoppingCart size={20} />
            Products
          </Link>
          <Link href="/stanger-user-dashboard/prices" className={styles.navLink}>
            <Tag size={20} />
            Prices & Deals
          </Link>
          <Link href="/stanger-user-dashboard/weekly-offers" className={styles.navLink}>
            <FileText size={20} />
            Weekly Offers
          </Link>
          <Link href="/stanger-user-dashboard/settings" className={styles.navLink}>
            <Settings size={20} />
            Settings & Ads
          </Link>
        </nav>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
