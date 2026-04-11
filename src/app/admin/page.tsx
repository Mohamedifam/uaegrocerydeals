import styles from './admin.module.css';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className={styles.pageTitle}>Dashboard Overview</h1>
      <div className={styles.card}>
        <h2>Welcome to the UAE Grocery Deals Admin Panel</h2>
        <p style={{ marginTop: '1rem', color: '#64748b' }}>
          Use the sidebar to navigate to store management, product catalog, and weekly deal updates.
        </p>
      </div>
    </div>
  );
}
