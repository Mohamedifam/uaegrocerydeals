import Link from 'next/link';
import styles from './admin.module.css';
import { Store, ShoppingCart, Tag, LayoutDashboard } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>Deals Admin</div>
        <nav>
          <Link href="/admin" className={styles.navLink}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/admin/stores" className={styles.navLink}>
            <Store size={20} />
            Stores
          </Link>
          <Link href="/admin/products" className={styles.navLink}>
            <ShoppingCart size={20} />
            Products
          </Link>
          <Link href="/admin/prices" className={styles.navLink}>
            <Tag size={20} />
            Prices & Deals
          </Link>
        </nav>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
