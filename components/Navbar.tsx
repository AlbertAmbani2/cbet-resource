
import React, { useState } from 'react';
import { ShoppingCart, Menu, X, User, Search, BookOpen } from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  userRole: UserRole;
  setRole: (role: UserRole) => void;
  cartCount: number;
  onSearch: (term: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ userRole, setRole, cartCount, onSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold tracking-tight text-slate-900">cbet<span className="text-blue-600">resources</span></span>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            </form>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <select 
              className="text-sm font-medium text-slate-600 bg-transparent border-none focus:ring-0 cursor-pointer"
              value={userRole}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              <option value={UserRole.BUYER}>Student View</option>
              <option value={UserRole.SELLER}>Educator View</option>
            </select>
            
            <button className="relative p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ShoppingCart className="h-6 w-6 text-slate-600" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            
            <button className="flex items-center space-x-2 p-1.5 border border-slate-200 rounded-full hover:bg-slate-50 transition-all">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">JD</div>
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 py-4 px-4 space-y-4">
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full bg-slate-100 border-none rounded-lg py-2 px-4"
          />
          <div className="flex flex-col space-y-2">
            <button className="text-left py-2 font-medium">Browse Categories</button>
            <button className="text-left py-2 font-medium">My Downloads</button>
            <button className="text-left py-2 font-medium">Cart ({cartCount})</button>
            <hr />
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-500">View as</span>
              <select 
                className="text-sm font-medium"
                value={userRole}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                <option value={UserRole.BUYER}>Student</option>
                <option value={UserRole.SELLER}>Educator</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
