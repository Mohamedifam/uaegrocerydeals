import '../globals.css';
import Script from 'next/script';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      <div className="bg-slate-50 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center justify-between w-full md:w-auto">
              <h1 className="text-xl md:text-2xl font-extrabold text-emerald-600 truncate">UAE Grocery Deals</h1>
              <button className="md:hidden text-slate-500 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-4 w-full md:w-1/2">
              <input 
                type="text" 
                placeholder="Search 50,000+ items..." 
                className="w-full px-4 py-2 md:py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm md:text-base" 
              />
            </div>
          </div>
          <nav className="border-t bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex gap-4 md:gap-6 text-xs md:text-sm font-bold overflow-x-auto whitespace-nowrap no-scrollbar">
              <a href="/" className="text-emerald-600 hover:text-emerald-700">ALL DEALS</a>
              <a href="#" className="text-slate-600 hover:text-emerald-600 uppercase">Supermarkets</a>
              <a href="#" className="text-slate-600 hover:text-emerald-600 uppercase">Fresh Food</a>
              <a href="#" className="text-slate-600 hover:text-emerald-600 uppercase">Beverages</a>
              <a href="#" className="text-slate-600 hover:text-emerald-600 uppercase">Household</a>
              <a href="#" className="text-slate-600 hover:text-emerald-600 uppercase">Personal Care</a>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-300 py-10 mt-auto">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2026 UAE Grocery Deals. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
