'use client';
import { useState, useEffect, useMemo } from 'react';

export default function Home() {
  const [deals, setDeals] = useState<any[]>([]);
  const [weeklyOffers, setWeeklyOffers] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState<any>({});
  const [activeAds, setActiveAds] = useState<any[]>([]);
  const [tableFilter, setTableFilter] = useState({ store: '', location: '' });

  useEffect(() => {
    async function load() {
      try {
        const [resDeals, resStores, resOffers, resSettings] = await Promise.all([
          fetch('/api/public/deals'),
          fetch('/api/admin/stores'),
          fetch('/api/public/weekly-offers'),
          fetch('/api/public/settings')
        ]);
        
        if (resDeals.ok) setDeals(await resDeals.json());
        if (resStores.ok) setStores(await resStores.json());
        if (resOffers.ok) setWeeklyOffers(await resOffers.json());
        if (resSettings.ok) {
          const data = await resSettings.json();
          setSiteSettings(data.settings || {});
          setActiveAds(data.ads || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredWeeklyOffers = useMemo(() => {
    return weeklyOffers.filter(offer => {
      const matchStore = !tableFilter.store || offer.storeId === tableFilter.store;
      const matchLocation = !tableFilter.location || 
        (offer.store?.location?.toLowerCase().includes(tableFilter.location.toLowerCase()) || false);
      return matchStore && matchLocation;
    });
  }, [weeklyOffers, tableFilter]);

  const bestOffers = deals.filter(d => d.isBestDeal && d.product).slice(0, 3);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-6xl font-extrabold leading-tight tracking-tight">
              {siteSettings.heroTitle || "Save More on Every Grocery Trip"}
            </h2>
            <p className="mt-5 text-xl text-emerald-50 max-w-lg">
              {siteSettings.heroSubtitle || "Compare prices, discover weekly flyers, and find the best supermarket deals across UAE instantly."}
            </p>
            <div className="mt-10 flex gap-4">
              <button className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-emerald-50 transition-all">Explore Deals</button>
              <button className="border-2 border-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all">Publish Ad</button>
            </div>
          </div>
          <div className="hidden md:block">
            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e" className="rounded-[40px] shadow-2xl border-8 border-white/10" alt="Groceries" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 transform hover:-translate-y-1 transition-all">
            <h3 className="text-4xl font-black text-emerald-600 tracking-tighter">{loading ? '...' : '50K+'}</h3>
            <p className="text-slate-500 font-bold uppercase text-xs mt-1">Products</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 transform hover:-translate-y-1 transition-all">
            <h3 className="text-4xl font-black text-cyan-600 tracking-tighter">{loading ? '...' : (stores.length > 0 ? `${stores.length}+` : '120+')}</h3>
            <p className="text-slate-500 font-bold uppercase text-xs mt-1">Stores</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 transform hover:-translate-y-1 transition-all">
            <h3 className="text-4xl font-black text-orange-500 tracking-tighter">{loading ? '...' : (deals.length > 0 ? `${deals.length}+` : '1K+')}</h3>
            <p className="text-slate-500 font-bold uppercase text-xs mt-1">Deals Today</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 transform hover:-translate-y-1 transition-all">
            <h3 className="text-4xl font-black text-pink-500 tracking-tighter">24/7</h3>
            <p className="text-slate-500 font-bold uppercase text-xs mt-1">Updates</p>
          </div>
        </div>
      </section>

      {/* Ad Banner Area */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {activeAds.length > 0 ? (
          <div className="overflow-hidden rounded-[3rem] shadow-2xl">
             <div className="flex">
                {activeAds.map(ad => (
                  <a key={ad.id} href={ad.linkUrl || '#'} target="_blank" rel="noreferrer" className="min-w-full">
                    <img src={ad.imageUrl} alt={ad.title || 'Advertisement'} className="w-full h-auto object-cover max-h-[400px]" />
                  </a>
                ))}
             </div>
          </div>
        ) : (
          <div className="bg-[#2D3748] rounded-[3rem] p-16 text-center shadow-2xl border border-slate-700 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-transparent opacity-50"></div>
            <p className="text-emerald-400 text-sm font-black uppercase tracking-[0.2em] relative mb-4">Advertisement Space</p>
            <h2 className="text-5xl font-black text-white relative mb-6">📢 Publish Your Ad Here</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto relative mb-10 font-medium">Your supermarket flyer or promotional banner will appear in this area reaching thousands of shoppers.</p>
            <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-900/20 transition-all relative">Upload Ad Banner</button>
          </div>
        )}
      </section>

      {/* Weekly Hot Deals */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-black text-slate-800 flex items-center gap-3">
            <span className="text-5xl">🔥</span> Weekly Hot Deals
          </h2>
          <button className="text-emerald-600 font-black text-sm uppercase tracking-wider hover:underline">View All</button>
        </div>
        
        {loading ? (
          <div className="grid md:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="bg-slate-200 h-[400px] rounded-[2.5rem]"></div>)}
          </div>
        ) : bestOffers.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {bestOffers.map(deal => (
              <div key={deal.id} className="bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100 group">
                <div className="relative h-64 w-full overflow-hidden">
                  <img 
                    src={deal.product?.imageUrl || 'https://images.unsplash.com/photo-1586201375761-83865001e31c'} 
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={deal.product?.name}
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-rose-50 text-rose-600 px-4 py-2 rounded-2xl text-sm font-black shadow-sm">
                      {deal.price} AED
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <span className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    {deal.store?.name}
                  </span>
                  <h3 className="mt-5 font-black text-2xl text-slate-800 leading-tight">{deal.product?.name}</h3>
                  <p className="text-slate-400 font-bold text-sm mt-3 flex items-center gap-2">
                    <span className="text-lg">📍</span> {deal.store?.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
            <p className="text-slate-300 font-bold text-xl">No hot deals active right now.</p>
          </div>
        )}
      </section>

      {/* Weekly Offers Table */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <h2 className="text-4xl font-black text-slate-800 flex items-center gap-3">
            <span className="text-5xl">📋</span> Weekly Offers Table
          </h2>
          <button className="text-emerald-600 font-black text-sm uppercase tracking-wider hover:underline">View All Offers</button>
        </div>
        
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-emerald-600 text-white">
                <tr>
                  <th className="px-8 py-6 font-black uppercase text-sm tracking-widest">Supermarket Name</th>
                  <th className="px-8 py-6 font-black uppercase text-sm tracking-widest">Description</th>
                  <th className="px-8 py-6 font-black uppercase text-sm tracking-widest">Start Date</th>
                  <th className="px-8 py-6 font-black uppercase text-sm tracking-widest">End Date</th>
                  <th className="px-8 py-6 font-black uppercase text-sm tracking-widest text-center">File</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={5} className="px-8 py-16 text-center text-slate-400 font-bold">Fetching latest offers...</td></tr>
                ) : filteredWeeklyOffers.length > 0 ? (
                  filteredWeeklyOffers.map(offer => (
                    <tr key={offer.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-black text-emerald-600 text-lg">{offer.store?.name}</div>
                        <div className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tighter">📍 {offer.store?.location}</div>
                      </td>
                      <td className="px-8 py-6 text-slate-600 font-bold">{offer.title || 'Weekly Promotion'}</td>
                      <td className="px-8 py-6 text-slate-500 font-medium">
                        {new Date(offer.validFrom).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-8 py-6 text-slate-500 font-medium">
                        {new Date(offer.validTo).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center gap-3">
                          <a href={offer.pdfUrl} target="_blank" className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
                            <span>👁</span> View
                          </a>
                          <a href={offer.pdfUrl} download className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-rose-200 transition-all flex items-center gap-2">
                            <span>📄</span> Download
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-300 font-bold text-xl">No active offers matching your search.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
