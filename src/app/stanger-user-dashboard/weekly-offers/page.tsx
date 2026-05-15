'use client';
import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { upload } from '@vercel/blob/client';

export default function WeeklyOffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);

  // Form states
  const [storeId, setStoreId] = useState('');
  const [title, setTitle] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validTo, setValidTo] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    const [resOffers, resStores] = await Promise.all([
      fetch('/api/admin/weekly-offers', { cache: 'no-store' }),
      fetch('/api/admin/stores', { cache: 'no-store' })
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

    try {
      // Direct browser-to-blob upload (bypasses 4.5MB limit)
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/upload/blob-token',
      });
      pdfUrl = newBlob.url;
    } catch (error: any) {
      console.error('Upload error:', error);
      
      // Fallback for local development if BLOB token is missing
      if (error.message?.includes('BLOB_READ_WRITE_TOKEN')) {
        console.log('Falling back to local server upload...');
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
          alert("Upload failed. For large files, ensure Vercel Blob is connected.");
          setUploading(false);
          return;
        }
      } else {
        alert(`Failed to upload: ${error.message}`);
        setUploading(false);
        return;
      }
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

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedOffers.length} offers?`)) return;
    
    let successCount = 0;
    for (const id of selectedOffers) {
      try {
        const res = await fetch(`/api/admin/weekly-offers?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          successCount++;
        } else {
          const errText = await res.text();
          alert(`Failed to delete ID ${id}. Server says: ${errText}`);
        }
      } catch (e: any) {
        console.error('Failed to delete', id, e);
        alert(`Network error deleting ID ${id}: ${e.message}`);
      }
    }
    
    if (successCount > 0) {
       setOffers(prev => prev.filter(o => !selectedOffers.includes(o.id)));
       setSelectedOffers([]);
    }
    if (successCount !== selectedOffers.length) {
       // alert(`Deleted ${successCount} out of ${selectedOffers.length} offers.`);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedOffers(prev => 
      prev.includes(id) ? prev.filter(selId => selId !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedOffers.length === offers.length && offers.length > 0) {
      setSelectedOffers([]);
    } else {
      setSelectedOffers(offers.map(o => o.id));
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Active & Past Offers</h2>
          {selectedOffers.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              Delete Selected ({selectedOffers.length})
            </button>
          )}
        </div>
        <table className={styles.table} style={{ marginTop: '1.5rem', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>
                <input 
                  type="checkbox" 
                  checked={offers.length > 0 && selectedOffers.length === offers.length}
                  onChange={toggleAll}
                  style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                />
              </th>
              <th>Store</th>
              <th>Title</th>
              <th>Valid Dates</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map(o => (
              <tr key={o.id}>
                <td style={{ textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedOffers.includes(o.id)}
                    onChange={() => toggleSelection(o.id)}
                    style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                  />
                </td>
                <td>{o.store?.name} <small>({o.store?.location})</small></td>
                <td>{o.title || '-'}</td>
                <td>{new Date(o.validFrom).toLocaleDateString()} - {new Date(o.validTo).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <a href={o.pdfUrl} target="_blank" rel="noreferrer" style={{ color: '#0ea5e9', fontWeight: 'bold' }}>View / Download</a>
                  </div>
                </td>
              </tr>
            ))}
            {offers.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No weekly offers added yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
