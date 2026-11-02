import React, { useState } from 'react';
import { Menu, X, Phone, MessageCircle, Smartphone, Search } from 'lucide-react';
import { DEFAULT_WHATSAPP_NUMBER, generateGeneralInquiryWhatsAppUrl } from '@/utils/whatsapp';

interface NavbarProps {
  currentTab: 'home' | 'products' | 'contact';
  setCurrentTab: (tab: 'home' | 'products' | 'contact') => void;
  onSelectCategory?: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const handleNavClick = (tab: 'home' | 'products' | 'contact') => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-[#1E6FD9]/40 bg-zinc-900 flex-shrink-0 group-hover:border-[#1E6FD9] transition-all shadow-[0_0_15px_rgba(30,111,217,0.25)]">
              <img
                src="/logo-transparent.png"
                alt="Cell and More"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1">
                Cell <span className="text-[#1E6FD9]">&</span> More
              </span>
              <span className="text-[10px] sm:text-xs text-zinc-400 font-medium tracking-wider uppercase">
                Phones & Accessories • Lebanon
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'home'
                  ? 'text-white bg-zinc-800/80 border border-zinc-700'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('products')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'products'
                  ? 'text-white bg-zinc-800/80 border border-zinc-700'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'contact'
                  ? 'text-white bg-zinc-800/80 border border-zinc-700'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Contact & Location
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Toggle */}
            <div className="relative">
              {showSearchInput ? (
                <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-full px-3 py-1.5 w-40 sm:w-56 transition-all">
                  <Search className="w-4 h-4 text-zinc-400 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search phones..."
                    autoFocus
                    className="w-full bg-transparent text-xs sm:text-sm text-white focus:outline-none placeholder-zinc-500"
                  />
                  <button
                    onClick={() => {
                      setShowSearchInput(false);
                      setSearchQuery('');
                    }}
                    className="text-zinc-500 hover:text-white ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowSearchInput(true);
                    if (currentTab !== 'products') setCurrentTab('products');
                  }}
                  className="p-2 sm:px-3 sm:py-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full sm:rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
                  title="Search products"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs">Search</span>
                </button>
              )}
            </div>

            {/* Direct WhatsApp button */}
            <a
              href={generateGeneralInquiryWhatsAppUrl(DEFAULT_WHATSAPP_NUMBER)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#1E6FD9] hover:bg-[#1858ad] text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold shadow-md shadow-[#1E6FD9]/20 transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span className="hidden sm:inline">WhatsApp Order</span>
              <span className="sm:hidden">Chat</span>
            </a>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-zinc-800 space-y-2 bg-zinc-950/95 px-2 rounded-b-2xl animate-in slide-in-from-top duration-200">
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                currentTab === 'home' ? 'bg-[#1E6FD9]/20 text-[#1E6FD9] border border-[#1E6FD9]/40' : 'text-zinc-300'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('products')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                currentTab === 'products' ? 'bg-[#1E6FD9]/20 text-[#1E6FD9] border border-[#1E6FD9]/40' : 'text-zinc-300'
              }`}
            >
              All Products Catalog
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                currentTab === 'contact' ? 'bg-[#1E6FD9]/20 text-[#1E6FD9] border border-[#1E6FD9]/40' : 'text-zinc-300'
              }`}
            >
              Contact & Location
            </button>

            <div className="pt-2 border-t border-zinc-800">
              <a
                href={generateGeneralInquiryWhatsAppUrl(DEFAULT_WHATSAPP_NUMBER)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5b] text-black font-bold py-2.5 rounded-xl text-sm shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-black" />
                Chat on WhatsApp (+961)
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
