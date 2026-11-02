import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  LogOut,
  KeyRound,
  RefreshCw,
  ExternalLink,
  SlidersHorizontal,
  Check,
  AlertTriangle,
  Loader2,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { Product, ProductCategory } from '@/types';
import {
  subscribeToProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  toggleProductStock,
  forceSeedSampleProducts,
} from '@/services/productService';
import { ProductFormModal } from './ProductFormModal';
import { ChangeCodeModal } from './ChangeCodeModal';

const CATEGORIES: string[] = [
  'All',
  'Phones',
  'Accessories',
  'Chargers & Cables',
  'Cases & Screen Protectors',
];

interface AdminDashboardProps {
  onExitToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExitToStore }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isChangeCodeModalOpen, setIsChangeCodeModalOpen] = useState(false);

  // Deletion confirm modal
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Success toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Real-time Firestore subscription
  useEffect(() => {
    const unsubscribe = subscribeToProducts(
      (loadedProducts) => {
        setProducts(loadedProducts);
        setLoading(false);
      },
      (err) => {
        console.error('Admin products fetch error:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onExitToStore();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setIsFormModalOpen(true);
  };

  const handleSaveProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, productData);
      showToast('Product updated successfully.');
    } else {
      await addProduct(productData);
      showToast('Product added to catalog.');
    }
  };

  const handlePromptDelete = (productId: string) => {
    setDeletingProductId(productId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProductId) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deletingProductId);
      showToast('Product deleted.');
      setDeleteConfirmOpen(false);
      setDeletingProductId(null);
    } catch (err: any) {
      console.error('Delete error:', err);
      alert('Failed to delete product. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStock = async (prod: Product) => {
    try {
      await toggleProductStock(prod.id, prod.inStock);
      showToast(`Stock updated: ${prod.inStock ? 'Marked Out of Stock' : 'Marked In Stock'}`);
    } catch (err) {
      console.error('Stock toggle error:', err);
    }
  };

  const handleSeedSamples = async () => {
    if (!confirm('Add 12 sample phones and accessories to the database?')) return;
    setSeeding(true);
    try {
      await forceSeedSampleProducts();
      showToast('12 Sample products added successfully!');
    } catch (err: any) {
      console.error('Seed error:', err);
      alert('Failed to seed sample products.');
    } finally {
      setSeeding(false);
    }
  };

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (stockFilter === 'in-stock' && !p.inStock) return false;
    if (stockFilter === 'out-of-stock' && p.inStock) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1E6FD9] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-30 bg-zinc-950/95 border-b border-zinc-850 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#1E6FD9]/50 bg-zinc-900 p-0.5 shadow-md">
              <img src="/logo-transparent.png" alt="Cell & More" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                  Cell & More
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#1E6FD9]/20 text-[#1E6FD9] text-[10px] font-bold border border-[#1E6FD9]/40 uppercase tracking-wider">
                  Admin Panel
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Secret Management • Real-time Firestore Sync
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsChangeCodeModalOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Change Access Code"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#1E6FD9]" />
              <span className="hidden md:inline">Change Code</span>
            </button>

            <button
              onClick={onExitToStore}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="View Public Store"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Public Store</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 hover:text-white border border-rose-800/80 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Log out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Title, Stats & Add Product Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Product Inventory
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              {products.length} total items in database • Updates reflect instantly on public store
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {products.length === 0 && (
              <button
                onClick={handleSeedSamples}
                disabled={seeding}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-200 flex items-center gap-2 transition-colors"
              >
                {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-[#1E6FD9]" />}
                <span>Add 12 Samples</span>
              </button>
            )}

            <button
              onClick={handleOpenAdd}
              className="px-5 py-2.5 rounded-xl bg-[#1E6FD9] hover:bg-[#185cb4] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#1E6FD9]/25 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-2xl mb-6 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by title, category, description..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#1E6FD9]"
              />
            </div>

            {/* Stock status filter */}
            <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs self-start md:self-auto">
              <button
                onClick={() => setStockFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  stockFilter === 'all' ? 'bg-[#1E6FD9] text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                All ({products.length})
              </button>
              <button
                onClick={() => setStockFilter('in-stock')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  stockFilter === 'in-stock' ? 'bg-emerald-700 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                In Stock ({products.filter((p) => p.inStock).length})
              </button>
              <button
                onClick={() => setStockFilter('out-of-stock')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  stockFilter === 'out-of-stock' ? 'bg-rose-800 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Out of Stock ({products.filter((p) => !p.inStock).length})
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-zinc-800 text-white border border-zinc-650'
                    : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-zinc-850'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Inventory Content */}
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 text-[#1E6FD9] animate-spin mx-auto mb-3" />
            <p className="text-xs text-zinc-400">Loading catalog from Firestore...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-12 text-center max-w-lg mx-auto">
            <Package className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-base font-bold text-white mb-1">No products match your filter</h3>
            <p className="text-xs text-zinc-400 mb-6">
              {products.length === 0
                ? 'Your catalog is empty. Click below to add sample products or add your first item.'
                : 'Try adjusting your search query or category filter.'}
            </p>
            {products.length === 0 ? (
              <button
                onClick={handleSeedSamples}
                disabled={seeding}
                className="px-5 py-2.5 rounded-xl bg-[#1E6FD9] hover:bg-[#185cb4] text-white text-xs font-bold transition-all shadow-md shadow-[#1E6FD9]/20"
              >
                Load 12 Sample Phones & Accessories
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setStockFilter('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          /* Products List Table / Cards */
          <div className="bg-zinc-950 border border-zinc-850 rounded-2xl overflow-hidden shadow-xl">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Item</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price (USD)</th>
                    <th className="py-3.5 px-4">Stock Status (One-Tap Toggle)</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850/80">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-zinc-900/40 transition-colors">
                      {/* Thumbnail & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-zinc-900 overflow-hidden border border-zinc-800 flex-shrink-0 flex items-center justify-center">
                            <img
                              src={prod.imageUrl}
                              alt={prod.name}
                              className={`w-full h-full object-cover ${!prod.inStock ? 'opacity-50 grayscale' : ''}`}
                            />
                          </div>
                          <div className="min-w-0 max-w-sm">
                            <div className="font-bold text-white truncate">{prod.name}</div>
                            <div className="text-[11px] text-zinc-400 line-clamp-1">{prod.description}</div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 font-medium">
                          {prod.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        ${prod.price.toLocaleString()}
                      </td>

                      {/* One-tap stock toggle */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStock(prod)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                            prod.inStock
                              ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300 hover:bg-emerald-900'
                              : 'bg-rose-950/80 border-rose-800 text-rose-300 hover:bg-rose-900'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              prod.inStock ? 'bg-emerald-400' : 'bg-rose-400'
                            }`}
                          />
                          <span>{prod.inStock ? 'In Stock' : 'Out of Stock'}</span>
                        </button>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(prod)}
                            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4 text-[#1E6FD9]" />
                          </button>
                          <button
                            onClick={() => handlePromptDelete(prod.id)}
                            className="p-2 rounded-xl bg-zinc-900 hover:bg-rose-950 text-zinc-400 hover:text-rose-400 border border-zinc-800 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-zinc-850">
              {filteredProducts.map((prod) => (
                <div key={prod.id} className="p-4 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-xl bg-zinc-900 overflow-hidden border border-zinc-800 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className={`w-full h-full object-cover ${!prod.inStock ? 'opacity-50 grayscale' : ''}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white text-sm leading-snug line-clamp-2">
                        {prod.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono font-bold text-white">
                          ${prod.price.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                          {prod.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
                    {/* One-tap stock toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleStock(prod)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                        prod.inStock
                          ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                          : 'bg-rose-950/80 border-rose-800 text-rose-300'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          prod.inStock ? 'bg-emerald-400' : 'bg-rose-400'
                        }`}
                      />
                      <span>{prod.inStock ? 'In Stock' : 'Out of Stock'}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="px-3 py-1.5 rounded-xl bg-zinc-900 text-zinc-300 text-xs font-semibold flex items-center gap-1 border border-zinc-800"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#1E6FD9]" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handlePromptDelete(prod.id)}
                        className="p-1.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-rose-400 border border-zinc-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Product Form Modal (Add / Edit) */}
      {isFormModalOpen && (
        <ProductFormModal
          initialProduct={editingProduct}
          onClose={() => setIsFormModalOpen(false)}
          onSave={handleSaveProduct}
        />
      )}

      {/* Change Access Code Modal */}
      {isChangeCodeModalOpen && (
        <ChangeCodeModal
          onClose={() => setIsChangeCodeModalOpen(false)}
          onSuccess={() => {
            setIsChangeCodeModalOpen(false);
            showToast('Access code changed successfully.');
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/80 text-rose-400 border border-rose-800/80 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white text-center mb-1">
              Confirm Product Deletion
            </h3>
            <p className="text-xs text-zinc-400 text-center mb-6">
              Are you sure you want to delete this product? This action cannot be undone and it will be removed from Firestore immediately.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/25"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
