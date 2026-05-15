'use client';
import { useState, useEffect } from 'react';
import styles from '../admin.module.css';

export default function StoresPage() {
  const [stores, setStores] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [logo, setLogo] = useState('');

  const fetchStores = async () => {
    const res = await fetch('/api/admin/stores');
    if (res.ok) {
      setStores(await res.json());
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/stores', {
      method: 'POST',
      body: JSON.stringify({ name, location, logo, active: true }),
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) {
      setName(''); setLocation(''); setLogo('');
      fetchStores();
    }
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Store Management</h1>
      
      <div className={styles.card}>
        <h2>Add New Store</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem', maxWidth: '500px' }}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Store Name</label>
            <input className={styles.formInput} value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Location</label>
            <input className={styles.formInput} value={location} onChange={e => setLocation(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Logo URL (optional)</label>
            <input className={styles.formInput} value={logo} onChange={e => setLogo(e.target.value)} />
          </div>
          <button className={styles.btnPrimary} type="submit">Save Store</button>
        </form>
      </div>

      <div className={styles.card}>
        <h2>Registered Stores</h2>
        <table className={styles.table} style={{ marginTop: '1.5rem' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stores.map(store => (
              <tr key={store.id}>
                <td>{store.name}</td>
                <td>{store.location}</td>
                <td>{store.active ? 'Active' : 'Inactive'}</td>
              </tr>
            ))}
            {stores.length === 0 && <tr><td colSpan={3}>No stores found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
