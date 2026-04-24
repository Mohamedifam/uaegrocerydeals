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
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-extrabold text-emerald-600">UAE Grocery Deals</h1>
            <div className="hidden md:flex items-center gap-4 w-1/2">
              <input 
                type="text" 
                placeholder="Search 50,000+ items..." 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>
            <button className="bg-emerald-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-emerald-700 transition-colors">Login</button>
          </div>
          <nav className="border-t bg-white">
            <div className="max-w-7xl mx-auto px-6 py-3 flex gap-6 text-sm font-medium overflow-x-auto whitespace-nowrap">
              <a href="/" className="text-emerald-600 hover:text-emerald-700">All Categories</a>
              <a href="#" className="hover:text-emerald-600">Fresh Food</a>
              <a href="#" className="hover:text-emerald-600">Fruits & Veg</a>
              <a href="#" className="hover:text-emerald-600">Beverages</a>
              <a href="#" className="hover:text-emerald-600">Baby Products</a>
              <a href="#" className="hover:text-emerald-600">Offers</a>
              <a href="/admin" className="ml-auto text-slate-500 hover:text-emerald-600 font-bold border-l pl-6">Admin Access</a>
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
