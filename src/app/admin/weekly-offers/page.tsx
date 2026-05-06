'use client';
import { useState, useEffect } from 'react';
import styles from '../admin.module.css';

export default function WeeklyOffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);

  // Form states
  const [storeId, setStoreId] = useState('');
  const [title, setTitle] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validTo, setValidTo] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    const [resOffers, resStores] = await Promise.all([
      fetch('/api/admin/weekly-offers'),
      fetch('/api/admin/stores')
    ]);
    if (resOffers.ok) setOffers(await resOffers.json());
    if (resStores.ok) setStores(await resStores.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
        alert("Please upload a PDF file for the Weekly Offer!");
        return;
    }

    setUploading(true);
    let pdfUrl = '';

    const formData = new FormData();
    formData.append('file', file);
    const uploadRes = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    if (uploadRes.ok) {
      const uData = await uploadRes.json();
      pdfUrl = uData.url;
    } else {
        const errorData = await uploadRes.json().catch(() => ({}));
        alert(`Failed to upload PDF: ${errorData.error || uploadRes.statusText}`);
        setUploading(false);
        return;
    }

    const res = await fetch('/api/admin/weekly-offers', {
      method: 'POST',
      body: JSON.stringify({
        title, storeId, validFrom, validTo, pdfUrl
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      setStoreId(''); setTitle('');
      setValidFrom(''); setValidTo(''); setFile(null);
      fetchData();
    } else {
        alert("Failed to save offer");
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    
    try {
      const res = await fetch(`/api/admin/weekly-offers?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchData();
      } else {
        alert('Failed to delete offer');
      }
    } catch (e) {
      console.error('Error deleting offer', e);
      alert('Error deleting offer');
    }
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Weekly Offers</h1>
      
      <div className={styles.card}>
        <h2>Add Weekly Offer PDF</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <div className={styles.formGroup} style={{ flex: '1 1 45%' }}>
            <label className={styles.formLabel}>Store</label>
            <select className={styles.formInput} value={storeId} onChange={e => setStoreId(e.target.value)} required>
              <option value="">Select Store</option>
              {stores.map(s => <option key={s.id} value={s.id}>{s.name} ({s.location})</option>)}
            </select>
          </div>
          <div className={styles.formGroup} style={{ flex: '1 1 45%' }}>
            <label className={styles.formLabel}>Offer Title (Optional)</label>
            <input type="text" className={styles.formInput} placeholder="e.g. Ramadan Special 2026" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className={styles.formGroup} style={{ flex: '1 1 45%' }}>
            <label className={styles.formLabel}>Valid From</label>
            <input type="date" className={styles.formInput} value={validFrom} onChange={e => setValidFrom(e.target.value)} required />
          </div>
          <div className={styles.formGroup} style={{ flex: '1 1 45%' }}>
            <label className={styles.formLabel}>Valid To</label>
            <input type="date" className={styles.formInput} value={validTo} onChange={e => setValidTo(e.target.value)} required />
          </div>
          <div className={styles.formGroup} style={{ flex: '1 1 100%' }}>
            <label className={styles.formLabel}>Upload PDF Catalog</label>
            <input type="file" accept="application/pdf" className={styles.formInput} onChange={e => setFile(e.target.files?.[0] || null)} required />
          </div>
          <div style={{ flex: '1 1 100%', marginTop: '1rem' }}>
            <button className={styles.btnPrimary} type="submit" disabled={uploading}>
              {uploading ? 'Uploading & Saving...' : 'Publish Weekly Offer'}
            </button>
          </div>
        </form>
      </div>

      <div className={styles.card} style={{ marginTop: '2rem' }}>
        <h2>Active & Past Offers</h2>
        <table className={styles.table} style={{ marginTop: '1.5rem' }}>
          <thead>
            <tr>
              <th>Store</th>
              <th>Title</th>
              <th>Valid Dates</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map(o => (
              <tr key={o.id}>
                <td>{o.store?.name} <small>({o.store?.location})</small></td>
                <td>{o.title || '-'}</td>
                <td>{new Date(o.validFrom).toLocaleDateString()} - {new Date(o.validTo).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <a href={o.pdfUrl} target="_blank" rel="noreferrer" style={{ color: '#0ea5e9', fontWeight: 'bold' }}>View / Download</a>
                    <button onClick={() => handleDelete(o.id)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {offers.length === 0 && <tr><td colSpan={4}>No weekly offers added yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
