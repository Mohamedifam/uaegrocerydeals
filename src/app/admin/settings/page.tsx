'use client';
import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { Settings, Image as ImageIcon, Save, Trash2, Plus } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [ads, setAds] = useState<any[]>([]);
  const [newAd, setNewAd] = useState({ title: '', imageUrl: '', linkUrl: '', active: true, order: 0 });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [resSettings, resAds] = await Promise.all([
        fetch('/api/admin/settings'),
        fetch('/api/admin/ads')
      ]);
      const settingsList = await resSettings.json();
      const settingsObj = settingsList.reduce((acc: any, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
      setSettings(settingsObj);
      setAds(await resAds.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setNewAd(prev => ({ ...prev, imageUrl: data.url }));
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (err) {
      alert('Error uploading file');
    } finally {
      setUploading(false);
    }
  }

  async function updateSetting(key: string, value: string) {
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      });
      setSettings((prev: any) => ({ ...prev, [key]: value }));
    } catch (e) {
      alert('Failed to update setting');
    }
  }

  async function addAd() {
    try {
      const res = await fetch('/api/admin/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAd)
      });
      if (res.ok) {
        setAds([...ads, await res.json()]);
        setNewAd({ title: '', imageUrl: '', linkUrl: '', active: true, order: 0 });
      }
    } catch (e) {
      alert('Failed to add ad');
    }
  }

  async function deleteAd(id: string) {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch('/api/admin/ads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      setAds(ads.filter(a => a.id !== id));
    } catch (e) {
      alert('Failed to delete ad');
    }
  }

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}><Settings size={28} /> Site Settings & Ads</h1>

      <section className={styles.card} style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Homepage Visibility</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <label className={styles.toggleLabel}>
            <input 
              type="checkbox" 
              checked={settings.showWeeklyTopPicks === 'true'} 
              onChange={e => updateSetting('showWeeklyTopPicks', e.target.checked.toString())}
            />
            Show "Weekly Top Pick Deals" (Carousel)
          </label>
          <label className={styles.toggleLabel}>
            <input 
              type="checkbox" 
              checked={settings.showAllWeeklyDeals === 'true'} 
              onChange={e => updateSetting('showAllWeeklyDeals', e.target.checked.toString())}
            />
            Show "All Weekly Deals" (Cards)
          </label>
        </div>
      </section>

      <section className={styles.card}>
        <h2 style={{ marginBottom: '1.5rem' }}><ImageIcon size={20} /> Manage Banner Ads</h2>
        
        <div className={styles.addForm} style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '0.75rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Add New Ad Banner</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr auto', gap: '1rem', marginBottom: '1rem' }}>
            <input 
              className={styles.input} 
              placeholder="Ad Title (Internal)" 
              value={newAd.title} 
              onChange={e => setNewAd({...newAd, title: e.target.value})}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <input 
                type="file"
                accept="image/*"
                style={{ fontSize: '0.85rem' }}
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Recommended size: <strong>1200 x 300 pixels</strong>
                {uploading && <span style={{ marginLeft: '1rem', color: '#3b82f6' }}>Uploading...</span>}
                {newAd.imageUrl && !uploading && <span style={{ marginLeft: '1rem', color: '#10b981' }}>✓ File selected</span>}
              </span>
            </div>
            <button 
              className={styles.actionButton} 
              onClick={addAd} 
              disabled={uploading || !newAd.imageUrl}
              title={!newAd.imageUrl ? "Please upload an image first" : ""}
            >
              <Plus size={18}/> Add
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem' }}>
             <input 
              className={styles.input} 
              placeholder="Target Link URL (Optional)" 
              value={newAd.linkUrl} 
              onChange={e => setNewAd({...newAd, linkUrl: e.target.value})}
            />
          </div>
        </div>

        <div className={styles.adsList} style={{ display: 'grid', gap: '1rem' }}>
          {ads.map(ad => (
            <div key={ad.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem' }}>
              <img src={ad.imageUrl} alt={ad.title} style={{ width: '120px', height: '60px', objectFit: 'cover', borderRadius: '0.4rem' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{ad.title || 'Untitled Ad'}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{ad.linkUrl || 'No link'}</div>
              </div>
              <button className={styles.deleteButton} onClick={() => deleteAd(ad.id)}><Trash2 size={18} /></button>
            </div>
          ))}
          {ads.length === 0 && <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No ads configured yet.</p>}
        </div>
      </section>
    </div>
  );
}
