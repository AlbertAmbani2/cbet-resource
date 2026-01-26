
import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import ResourceCard from './components/ResourceCard';
import SellerDashboard from './components/SellerDashboard';
import AIRecommender from './components/AIRecommender';
import CheckoutModal from './components/CheckoutModal';
import { MOCK_RESOURCES } from './services/mockData';
import { UserRole, TVETCategory, Resource } from './types';
import { CATEGORIES, LEVELS } from './constants';
import { ChevronRight, Filter, LayoutGrid, List } from 'lucide-react';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.BUYER);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TVETCategory | 'ALL'>('ALL');
  const [cartCount, setCartCount] = useState(0);
  const [checkoutResource, setCheckoutResource] = useState<Resource | null>(null);
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);

  const filteredResources = useMemo(() => {
    return MOCK_RESOURCES.filter(r => {
      const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            r.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === 'ALL' || r.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchTerm, selectedCategory]);

  const handleBuy = (r: Resource) => {
    setCheckoutResource(r);
  };

  const handlePaymentSuccess = () => {
    if (checkoutResource) {
      setPurchasedIds(prev => [...prev, checkoutResource.id]);
      setCheckoutResource(null);
      setCartCount(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        userRole={role} 
        setRole={setRole} 
        cartCount={cartCount}
        onSearch={setSearchTerm}
      />

      <main className="flex-grow">
        {role === UserRole.SELLER ? (
          <SellerDashboard />
        ) : (
          <>
            {/* Hero Section */}
            <div className="bg-slate-900 text-white py-20 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
                  <div className="grid grid-cols-8 gap-4 rotate-12 -translate-x-20 -translate-y-20">
                     {[...Array(64)].map((_, i) => (
                       <div key={i} className="h-40 bg-blue-500 rounded-lg" />
                     ))}
                  </div>
               </div>
               
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                  <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
                    Powering TVET Excellence <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">Digital Resource Marketplace</span>
                  </h1>
                  <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                    Access high-quality CBET-aligned notes, schemes of work, and lesson plans from Kenya's top educators and institutions.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-900/40">
                      Explore Resources
                    </button>
                    <button className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all">
                      Become a Seller
                    </button>
                  </div>
               </div>
            </div>

            {/* AI Recommendations */}
            <AIRecommender userCategory={TVETCategory.ENGINEERING} onBuy={handleBuy} />

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="lg:w-64 flex-shrink-0">
                  <div className="sticky top-24 space-y-8">
                    <div>
                      <h3 className="flex items-center space-x-2 text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">
                        <Filter className="h-4 w-4" />
                        <span>Categories</span>
                      </h3>
                      <div className="space-y-1">
                        <button 
                          onClick={() => setSelectedCategory('ALL')}
                          className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${selectedCategory === 'ALL' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
                        >
                          All Categories
                        </button>
                        {CATEGORIES.map(cat => (
                          <button 
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${selectedCategory === cat ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Level</h3>
                      <div className="space-y-1">
                        {LEVELS.map(level => (
                          <label key={level} className="flex items-center space-x-3 px-3 py-2 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                            <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{level}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl">
                       <h4 className="font-bold mb-2">Need a Custom Resource?</h4>
                       <p className="text-xs text-blue-100 mb-4">Request specific lesson plans from our community of expert educators.</p>
                       <button className="w-full bg-white text-blue-700 py-2 rounded-xl font-bold text-sm">Make Request</button>
                    </div>
                  </div>
                </aside>

                {/* Grid */}
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        {selectedCategory === 'ALL' ? 'Latest Resources' : `${selectedCategory} Resources`}
                      </h2>
                      <p className="text-sm text-slate-500">Showing {filteredResources.length} items</p>
                    </div>
                    <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
                      <button className="p-2 bg-white rounded-lg shadow-sm text-slate-900"><LayoutGrid className="h-4 w-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-slate-600"><List className="h-4 w-4" /></button>
                    </div>
                  </div>

                  {filteredResources.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredResources.map(resource => (
                        <ResourceCard 
                          key={resource.id} 
                          resource={resource} 
                          onBuy={handleBuy}
                          isPurchased={purchasedIds.includes(resource.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                       <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                         <LayoutGrid className="h-10 w-10 text-slate-300" />
                       </div>
                       <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">No Resources Found</h3>
                       <p className="text-slate-500 max-w-sm mx-auto mb-8">
                         We couldn't find any resources matching your criteria. Try adjusting your filters or search term.
                       </p>
                       <button onClick={() => {setSearchTerm(''); setSelectedCategory('ALL')}} className="text-blue-600 font-bold hover:underline">
                         Clear all filters
                       </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="h-8 w-8 bg-blue-600 rounded-lg"></div>
                <span className="text-xl font-bold tracking-tight">cbetresources</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Kenya's premier marketplace for TVET digital resources. Supporting institutions with CBET-aligned academic materials.
              </p>
              <div className="flex space-x-4">
                {[1, 2, 3].map(i => <div key={i} className="h-8 w-8 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors"></div>)}
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6">Marketplace</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="hover:text-blue-400 cursor-pointer">Engineering</li>
                <li className="hover:text-blue-400 cursor-pointer">Business Management</li>
                <li className="hover:text-blue-400 cursor-pointer">ICT & Computer Science</li>
                <li className="hover:text-blue-400 cursor-pointer">Request Resource</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="hover:text-blue-400 cursor-pointer">About Us</li>
                <li className="hover:text-blue-400 cursor-pointer">Contact Support</li>
                <li className="hover:text-blue-400 cursor-pointer">Privacy Policy</li>
                <li className="hover:text-blue-400 cursor-pointer">Terms of Service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Institution Portals</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="hover:text-blue-400 cursor-pointer">Bulk Institution Access</li>
                <li className="hover:text-blue-400 cursor-pointer">Educator Onboarding</li>
                <li className="hover:text-blue-400 cursor-pointer">Partner with Us</li>
                <li className="hover:text-blue-400 cursor-pointer">Developer API</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-slate-500 mb-4 md:mb-0">© 2024 cbetresources. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-slate-500">Secure Payments via</span>
              <div className="flex space-x-2 grayscale opacity-50">
                <div className="h-4 w-10 bg-slate-700 rounded"></div>
                <div className="h-4 w-10 bg-slate-700 rounded"></div>
                <div className="h-4 w-10 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {checkoutResource && (
        <CheckoutModal 
          resource={checkoutResource} 
          onClose={() => setCheckoutResource(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default App;
