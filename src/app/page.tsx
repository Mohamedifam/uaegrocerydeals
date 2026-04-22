'use client';
import { useState, useEffect, useMemo } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [deals, setDeals] = useState<any[]>([]);
  const [weeklyOffers, setWeeklyOffers] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const resDeals = await fetch('/api/public/deals');
        const resStores = await fetch('/api/admin/stores');
        const resOffers = await fetch('/api/public/weekly-offers');
        if (resDeals.ok) setDeals(await resDeals.json());
        if (resStores.ok) setStores(await resStores.json());
        if (resOffers.ok) setWeeklyOffers(await resOffers.json());
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

  const bestOffers = deals.filter(d => d.isBestDeal && d.product); // Ensure product exists

  return (
    <div>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Smart Grocery Shopping in the UAE</h1>
        <p className={styles.heroSubtitle}>
          Discover, compare, and get the lowest prices on fresh produce, 
          pantry essentials, and weekly flyer specials. Start shaving off your bills today.
        </p>
      </section>

      <section className={styles.adSection}>
        <div className={styles.adBanner}>
          <span className={styles.adText}>Publish your Ad here</span>
        </div>
      </section>

      {!loading && bestOffers.length > 0 && (
        <section className={styles.section} style={{ paddingBottom: '0' }}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>🏆 Weekly Top Pick Deals</h2>
          </div>
          <div className={styles.marqueeWrapper}>
            <div className={styles.marqueeContent}>
              {bestOffers.map(deal => (
                <DealCard key={deal.id} deal={deal} highlight={true} />
              ))}
              {/* Duplicate items for seamless loop */}
              {bestOffers.map(deal => (
                <DealCard key={`${deal.id}-dup`} deal={deal} highlight={true} />
              ))}
              {/* Third set to ensure it fills widescreen */}
              {bestOffers.map(deal => (
                <DealCard key={`${deal.id}-dup2`} deal={deal} highlight={true} />
              ))}
            </div>
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

      {weeklyOffers.length > 0 && (
        <section className={styles.section} style={{ paddingTop: '0' }}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Weekly Hot deals</h2>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.weeklyOffersTable}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Vendor | Description | Location</th>
                  <th>Deal Start</th>
                  <th>Deal End</th>
                  <th>Status</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {weeklyOffers.map(offer => (
                  <OfferTableRow key={offer.id} offer={offer} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function OfferTableRow({ offer }: { offer: any }) {
  const fromDate = new Date(offer.validFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const toDate = new Date(offer.validTo).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  // Mark as new if it was created recently (e.g., within the last 3 days)
  const isNew = new Date(offer.createdAt) >= new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  return (
    <tr>
      <td className={styles.vendorCell}>
        <div className={styles.vendorLogoPlaceholder}>
          {offer.store.name}
        </div>
        <div className={styles.vendorInfo}>
          <div className={styles.vendorTitle}>{offer.title || offer.store.name}</div>
          <div className={styles.vendorLocationBadge}>{offer.store.location}</div>
        </div>
      </td>
      <td>{fromDate}</td>
      <td>{toDate}</td>
      <td>
        <div className={styles.statusCell}>
          <span className={styles.statusValid}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Valid
          </span>
          {isNew && <span className={styles.statusNew}>New</span>}
        </div>
      </td>
      <td>
        <a href={offer.pdfUrl} target="_blank" rel="noreferrer" className={styles.viewButton}>
          View
        </a>
      </td>
    </tr>
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
