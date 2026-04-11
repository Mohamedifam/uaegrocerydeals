'use client';
import { useState, useEffect, useMemo } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [deals, setDeals] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const resDeals = await fetch('/api/public/deals');
        const resStores = await fetch('/api/admin/stores');
        if (resDeals.ok) setDeals(await resDeals.json());
        if (resStores.ok) setStores(await resStores.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredDeals = useMemo(() => {
    if (!selectedStore) return deals;
    return deals.filter(d => d.storeId === selectedStore);
  }, [deals, selectedStore]);

  const bestOffers = deals.filter(d => d.isBestDeal).slice(0, 3);

  return (
    <div>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Smart Grocery Shopping in the UAE</h1>
        <p className={styles.heroSubtitle}>
          Discover, compare, and get the lowest prices on fresh produce, 
          pantry essentials, and weekly flyer specials. Start shaving off your bills today.
        </p>
      </section>

      {!loading && bestOffers.length > 0 && (
        <section className={styles.section} style={{ paddingBottom: '0' }}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>🏆 Top Highlighted Deals</h2>
          </div>
          <div className={styles.grid}>
            {bestOffers.map(deal => (
              <DealCard key={deal.id} deal={deal} highlight={true} />
            ))}
          </div>
        </section>
      )}

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>📅 All Weekly Deals</h2>
          <div className={styles.filterBar}>
            <select className={styles.filterSelect} value={selectedStore} onChange={e => setSelectedStore(e.target.value)}>
              <option value="">All Stores</option>
              {stores.map(store => (
                <option key={store.id} value={store.id}>{store.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        {loading ? (
          <p style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading latest deals...</p>
        ) : filteredDeals.length > 0 ? (
          <div className={styles.grid}>
            {filteredDeals.map(deal => (
              <DealCard key={deal.id} deal={deal} highlight={false} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', background: '#f8fafc', borderRadius: '1rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0f172a' }}>No active deals found!</h3>
            <p style={{ color: '#64748b' }}>Check back later or try clearing the filters.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function DealCard({ deal, highlight }: { deal: any, highlight: boolean }) {
  return (
    <div className={styles.card}>
      {deal.isBestDeal && <div className={styles.bestDealBadge}>Ultimate Best Deal</div>}
      <div className={styles.cardContent}>
        <div className={styles.storeName}>
          <span>🏪</span> {deal.store.name}
        </div>
        <h3 className={styles.productName}>{deal.product.name}</h3>
        <div className={styles.location}>
          <span>📍</span> {deal.store.location} {deal.location ? `(${deal.location})` : ''}
        </div>
      </div>
      <div className={styles.cardFooter}>
        <div className={styles.priceContainer}>
          <div className={styles.priceLabel}>Price</div>
          <div className={styles.price}>{deal.price} AED</div>
        </div>
        {deal.pdfUrl && (
          <a href={deal.pdfUrl} target="_blank" className={styles.pdfButton}>
            📄 View Weekly Flyer
          </a>
        )}
      </div>
    </div>
  );
}
