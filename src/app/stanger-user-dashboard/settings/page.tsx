'use client';
import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { Settings, Image as ImageIcon, Save, Trash2, Plus } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [ads, setAds] = useState<any[]>([]);
  const [newAd, setNewAd] = useState({ title: '', imageUrl: '', linkUrl: '', active: true, order: 0 });
  const [uploading, setUploading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [changingPassword, setChangingPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      alert("New passwords don't match!");
      return;
    }
    setChangingPassword(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwordForm.current, newPassword: passwordForm.new })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Password updated successfully!');
        setPasswordForm({ current: '', new: '', confirm: '' });
      } else {
        alert(data.error || 'Failed to update password');
      }
    } catch (e) {
      alert('Error updating password');
    } finally {
      setChangingPassword(false);
    }
  }

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

  async function updateSetting(key: string, value: string) {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      });
    } catch (e) {
      console.error(e);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) setNewAd({ ...newAd, imageUrl: data.url });
      else alert('Upload failed: ' + (data.error || 'Unknown error'));
    } catch (err) {
      alert('Error uploading file');
    } finally {
      setUploading(false);
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
        setNewAd({ title: '', imageUrl: '', linkUrl: '', active: true, order: 0 });
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function deleteAd(id: string) {
    if (!confirm('Delete this ad?')) return;
    try {
      await fetch('/api/admin/ads?id=' + id, { method: 'DELETE' });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  }

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading settings...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}><Settings size={28} /> Site Settings & Ads</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Visibility Settings */}
        <section className={styles.card}>
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

        {/* Hero Content Settings */}
        <section className={styles.card}>
          <h2 style={{ marginBottom: '1.5rem' }}>Homepage Content</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Hero Title</label>
              <input 
                className={styles.input} 
                value={settings.heroTitle || ''} 
                placeholder="Save More on Every Grocery Trip"
                onChange={e => setSettings({...settings, heroTitle: e.target.value})}
                onBlur={e => updateSetting('heroTitle', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Hero Subtitle</label>
              <textarea 
                className={styles.input} 
                style={{ minHeight: '80px' }}
                value={settings.heroSubtitle || ''} 
                placeholder="Compare prices, discover weekly flyers..."
                onChange={e => setSettings({...settings, heroSubtitle: e.target.value})}
                onBlur={e => updateSetting('heroSubtitle', e.target.value)}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Security Settings */}
      <section className={styles.card} style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>🔐 Security Settings</h2>
        <form onSubmit={handlePasswordChange} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'flex-end' }}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Current Password</label>
            <input 
              type="password"
              className={styles.input}
              required
              value={passwordForm.current}
              onChange={e => setPasswordForm({...passwordForm, current: e.target.value})}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>New Password</label>
            <input 
              type="password"
              className={styles.input}
              required
              value={passwordForm.new}
              onChange={e => setPasswordForm({...passwordForm, new: e.target.value})}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Confirm New Password</label>
            <input 
              type="password"
              className={styles.input}
              required
              value={passwordForm.confirm}
              onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})}
            />
          </div>
          <button className={styles.btnPrimary} type="submit" disabled={changingPassword}>
            {changingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </section>

      <section className={styles.card}>
        <h2 style={{ marginBottom: '1.5rem' }}><ImageIcon size={20} /> Manage Banner Ads</h2>
        {/* ... existing ads management UI ... */}
        
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
