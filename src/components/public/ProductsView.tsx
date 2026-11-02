import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, ArrowUpDown, Smartphone } from 'lucide-react';
import { Product, ProductCategory } from '@/types';
import { ProductCard } from './ProductCard';

interface ProductsViewProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenDetails: (product: Product) => void;
  whatsappNumber?: string;
}

const CATEGORIES: (string)[] = [
  'All',
  'Phones',
  'Accessories',
  'Chargers & Cables',
  'Cases & Screen Protectors',
];

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
  onOpenDetails,
  whatsappNumber,
}) => {
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }
        // In-stock filter
        if (inStockOnly && !p.inStock) {
          return false;
        }
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          return matchName || matchDesc || matchCat;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [products, selectedCategory, inStockOnly, searchQuery, sortBy]);

  return (
    <div className="py-8 sm:py-12 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Title */}
        <div className="mb-6 sm:mb-8">
          <div className="text-xs font-bold text-[#1E6FD9] tracking-wider uppercase mb-1">
            Official Catalog
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Explore All Products
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Genuine mobile phones, fast chargers, cables, and premium cases in Lebanon
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="space-y-4 mb-8">
          {/* Search bar & Quick controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by model, brand, or accessory name..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#1E6FD9] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort & In-Stock toggles */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:flex-initial">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full sm:w-auto bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-3 text-xs sm:text-sm text-zinc-300 focus:outline-none focus:border-[#1E6FD9] appearance-none pr-8 cursor-pointer"
                >
                  <option value="default">Sort: Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
              </div>

              <button
                type="button"
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`px-3.5 py-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all flex-shrink-0 ${
                  inStockOnly
                    ? 'bg-emerald-950/60 border-emerald-700 text-emerald-400'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${inStockOnly ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                <span>In Stock Only</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills (Horizontally scrollable on mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                    isSelected
                      ? 'bg-[#1E6FD9] text-white shadow-md shadow-[#1E6FD9]/30'
                      : 'bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-850'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter & Active Filter Indicators */}
        <div className="flex items-center justify-between text-xs text-zinc-500 mb-6">
          <span>
            Showing <strong className="text-zinc-200">{filteredProducts.length}</strong> items
          </span>
          {(selectedCategory !== 'All' || inStockOnly || searchQuery) && (
            <button
              onClick={() => {
                onSelectCategory('All');
                setInStockOnly(false);
                setSearchQuery('');
              }}
              className="text-[#1E6FD9] hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Clear all filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetails={onOpenDetails}
                whatsappNumber={whatsappNumber}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-zinc-950 border border-zinc-900 rounded-3xl p-8 max-w-md mx-auto">
            <Smartphone className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-1">No products found</h3>
            <p className="text-xs text-zinc-400 mb-6">
              No products match your current search or category filter. Try clearing filters or searching for something else.
            </p>
            <button
              onClick={() => {
                onSelectCategory('All');
                setInStockOnly(false);
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
