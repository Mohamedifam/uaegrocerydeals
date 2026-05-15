'use client';
import { useState, useEffect } from 'react';
import styles from '../admin.module.css';

export default function PricesPage() {
  const [prices, setPrices] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  // Form states
  const [productId, setProductId] = useState('');
  const [storeId, setStoreId] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validTo, setValidTo] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    const [resPrices, resStores, resProducts] = await Promise.all([
      fetch('/api/admin/prices'),
      fetch('/api/admin/stores'),
      fetch('/api/admin/products')
    ]);
    if (resPrices.ok) setPrices(await resPrices.json());
    if (resStores.ok) setStores(await resStores.json());
    if (resProducts.ok) setProducts(await resProducts.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    let pdfUrl = '';

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (uploadRes.ok) {
        const uData = await uploadRes.json();
        pdfUrl = uData.url;
      }
    }

    const res = await fetch('/api/admin/prices', {
      method: 'POST',
      body: JSON.stringify({
        productId, storeId, location, price, validFrom, validTo, pdfUrl
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      setProductId(''); setStoreId(''); setLocation('');
      setPrice(''); setValidFrom(''); setValidTo(''); setFile(null);
      fetchData();
    }
    setUploading(false);
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Price & Deals Management</h1>
      
      <div className={styles.card}>
        <h2>Add Weekly Deal</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <div className={styles.formGroup} style={{ flex: '1 1 45%' }}>
            <label className={styles.formLabel}>Store</label>
            <select className={styles.formInput} value={storeId} onChange={e => setStoreId(e.target.value)} required>
              <option value="">Select Store</option>
              {stores.map(s => <option key={s.id} value={s.id}>{s.name} ({s.location})</option>)}
            </select>
          </div>
          <div className={styles.formGroup} style={{ flex: '1 1 45%' }}>
            <label className={styles.formLabel}>Product</label>
            <select className={styles.formInput} value={productId} onChange={e => setProductId(e.target.value)} required>
              <option value="">Select Product</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className={styles.formGroup} style={{ flex: '1 1 20%' }}>
            <label className={styles.formLabel}>Price (AED)</label>
            <input type="number" step="0.01" className={styles.formInput} value={price} onChange={e => setPrice(e.target.value)} required />
          </div>
          <div className={styles.formGroup} style={{ flex: '1 1 30%' }}>
            <label className={styles.formLabel}>Valid From</label>
            <input type="date" className={styles.formInput} value={validFrom} onChange={e => setValidFrom(e.target.value)} required />
          </div>
          <div className={styles.formGroup} style={{ flex: '1 1 30%' }}>
            <label className={styles.formLabel}>Valid To</label>
            <input type="date" className={styles.formInput} value={validTo} onChange={e => setValidTo(e.target.value)} required />
          </div>
          <div className={styles.formGroup} style={{ flex: '1 1 100%' }}>
            <label className={styles.formLabel}>Weekly Offer PDF (Optional)</label>
            <input type="file" accept="application/pdf" className={styles.formInput} onChange={e => setFile(e.target.files?.[0] || null)} />
          </div>
          <div style={{ flex: '1 1 100%', marginTop: '1rem' }}>
            <button className={styles.btnPrimary} type="submit" disabled={uploading}>
              {uploading ? 'Saving Uploading...' : 'Save Deal'}
            </button>
          </div>
        </form>
      </div>

      <div className={styles.card}>
        <h2>Current Deals</h2>
        <table className={styles.table} style={{ marginTop: '1.5rem' }}>
          <thead>
            <tr>
              <th>Store</th>
              <th>Product</th>
              <th>Price</th>
              <th>Valid Dates</th>
              <th>PDF</th>
            </tr>
          </thead>
          <tbody>
            {prices.map(p => (
              <tr key={p.id}>
                <td>{p.store?.name}</td>
                <td>{p.product?.name}</td>
                <td style={{ fontWeight: 600, color: '#16a34a' }}>{p.price} AED</td>
                <td>{new Date(p.validFrom).toLocaleDateString()} - {new Date(p.validTo).toLocaleDateString()}</td>
                <td>{p.pdfUrl ? <a href={p.pdfUrl} target="_blank" style={{ color: '#0ea5e9' }}>View PDF</a> : 'N/A'}</td>
              </tr>
            ))}
            {prices.length === 0 && <tr><td colSpan={5}>No deals configured.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
