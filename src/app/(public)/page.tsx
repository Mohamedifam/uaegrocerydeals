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
      <section className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-12 md:py-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-8 md:gap-10 items-center relative z-10">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
              {siteSettings.heroTitle || "Save More on Every Grocery Trip"}
            </h2>
            <p className="mt-4 md:mt-5 text-lg md:text-xl text-emerald-50 max-w-lg mx-auto md:mx-0">
              {siteSettings.heroSubtitle || "Compare prices, discover weekly flyers, and find the best supermarket deals across UAE instantly."}
            </p>
            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-emerald-50 transition-all active:scale-95">Explore All Deals</button>
              <button className="bg-emerald-600/30 border-2 border-white/50 px-8 py-4 rounded-2xl font-black hover:bg-white/10 transition-all backdrop-blur-sm">View Flyers</button>
            </div>
          </div>
          <div className="hidden md:block">
            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e" className="rounded-[40px] shadow-2xl border-8 border-white/10" alt="Groceries" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 -mt-8 md:-mt-12 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white p-5 md:p-8 rounded-[2rem] shadow-xl border border-slate-100 flex flex-col items-center md:items-start">
            <h3 className="text-3xl md:text-4xl font-black text-emerald-600 tracking-tighter">{loading ? '...' : '50K+'}</h3>
            <p className="text-slate-400 font-bold uppercase text-[10px] md:text-xs mt-1">Products</p>
          </div>
          <div className="bg-white p-5 md:p-8 rounded-[2rem] shadow-xl border border-slate-100 flex flex-col items-center md:items-start">
            <h3 className="text-3xl md:text-4xl font-black text-cyan-600 tracking-tighter">{loading ? '...' : (stores.length > 0 ? `${stores.length}+` : '120+')}</h3>
            <p className="text-slate-400 font-bold uppercase text-[10px] md:text-xs mt-1">Stores</p>
          </div>
          <div className="bg-white p-5 md:p-8 rounded-[2rem] shadow-xl border border-slate-100 flex flex-col items-center md:items-start">
            <h3 className="text-3xl md:text-4xl font-black text-orange-500 tracking-tighter">{loading ? '...' : (deals.length > 0 ? `${deals.length}+` : '1K+')}</h3>
            <p className="text-slate-400 font-bold uppercase text-[10px] md:text-xs mt-1">Deals</p>
          </div>
          <div className="bg-white p-5 md:p-8 rounded-[2rem] shadow-xl border border-slate-100 flex flex-col items-center md:items-start">
            <h3 className="text-3xl md:text-4xl font-black text-pink-500 tracking-tighter">24/7</h3>
            <p className="text-slate-400 font-bold uppercase text-[10px] md:text-xs mt-1">Updates</p>
          </div>
        </div>
      </section>

      {/* Ad Banner Area */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16">
        {activeAds.length > 0 ? (
          <div className="overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-2xl">
             <div className="flex">
                {activeAds.map(ad => (
                  <a key={ad.id} href={ad.linkUrl || '#'} target="_blank" rel="noreferrer" className="min-w-full">
                    <img src={ad.imageUrl} alt={ad.title || 'Advertisement'} className="w-full h-auto object-cover max-h-[250px] md:max-h-[400px]" />
                  </a>
                ))}
             </div>
          </div>
        ) : (
          <div className="bg-[#1e293b] rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 text-center shadow-2xl border border-slate-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"></div>
            <p className="text-emerald-400 text-[10px] md:text-sm font-black uppercase tracking-[0.2em] mb-4">Advertisement</p>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">📢 Your Brand Here</h2>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-10 font-medium">Reach thousands of shoppers daily with your supermarket promotions.</p>
            <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 md:px-10 py-3 md:py-4 rounded-2xl font-black md:text-lg shadow-xl shadow-emerald-900/20 transition-all relative">Contact Sales</button>
          </div>
        )}
      </section>

      {/* Weekly Hot Deals */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 flex items-center gap-3">
            <span className="text-4xl md:text-5xl">🔥</span> Weekly Hot Deals
          </h2>
          <button className="bg-slate-100 text-slate-600 px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest hover:bg-emerald-100 hover:text-emerald-700 transition-colors">View All</button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="bg-slate-200 h-[350px] md:h-[400px] rounded-[2rem] md:rounded-[2.5rem]"></div>)}
          </div>
        ) : bestOffers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {bestOffers.map(deal => (
              <div key={deal.id} className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100 group">
                <div className="relative h-56 md:h-64 w-full overflow-hidden">
                  <img 
                    src={deal.product?.imageUrl || 'https://images.unsplash.com/photo-1586201375761-83865001e31c'} 
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={deal.product?.name}
                  />
                  <div className="absolute top-4 left-4 md:top-6 md:left-6">
                    <span className="bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-black shadow-lg">
                      {deal.price} AED
                    </span>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                      {deal.store?.name}
                    </span>
                    {deal.isBestDeal && <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">Best Price</span>}
                  </div>
                  <h3 className="mt-4 font-black text-xl md:text-2xl text-slate-800 leading-tight h-14 line-clamp-2">{deal.product?.name}</h3>
                  <p className="text-slate-400 font-bold text-xs md:text-sm mt-3 flex items-center gap-2">
                    <span className="text-lg">📍</span> {deal.store?.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[2rem] md:rounded-[3rem] border-4 border-dashed border-slate-100">
            <p className="text-slate-300 font-bold text-lg md:text-xl">No hot deals active right now.</p>
          </div>
        )}
      </section>

      {/* Weekly Offers Table / Mobile Cards */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 flex items-center gap-3">
              <span className="text-4xl md:text-5xl">📋</span> Supermarket Flyers
            </h2>
            <p className="text-slate-500 font-medium mt-1">Browse the latest weekly promotional catalogs</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <select 
              className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex-1"
              onChange={(e) => setTableFilter(f => ({ ...f, store: e.target.value }))}
            >
              <option value="">All Stores</option>
              {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>
        
        {/* Mobile View: Cards */}
        <div className="md:hidden grid gap-4">
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="bg-slate-200 h-32 rounded-2xl animate-pulse"></div>)
          ) : filteredWeeklyOffers.length > 0 ? (
            filteredWeeklyOffers.map(offer => (
              <div key={offer.id} className="bg-white p-5 rounded-[1.5rem] shadow-md border border-slate-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-emerald-600 text-lg leading-tight">{offer.store?.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">📍 {offer.store?.location}</p>
                  </div>
                  <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Flyer</div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 font-bold text-sm">{offer.title || 'Weekly Deals'}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Valid: {new Date(offer.validFrom).toLocaleDateString('en-GB')} - {new Date(offer.validTo).toLocaleDateString('en-GB')}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={offer.pdfUrl} target="_blank" className="bg-emerald-500 text-white p-3 rounded-xl shadow-lg shadow-emerald-100 active:scale-95">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-white rounded-2xl border-2 border-dashed border-slate-100 text-slate-300 font-bold">No flyers found</div>
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
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
