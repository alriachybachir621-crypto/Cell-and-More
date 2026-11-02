import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { WhatsAppFloating } from '@/components/common/WhatsAppFloating';
import { Hero } from '@/components/public/Hero';
import { CategoryCards } from '@/components/public/CategoryCards';
import { ProductCard } from '@/components/public/ProductCard';
import { ProductModal } from '@/components/public/ProductModal';
import { ProductsView } from '@/components/public/ProductsView';
import { ContactView } from '@/components/public/ContactView';
import { NotFoundView } from '@/components/public/NotFoundView';
import { Product, ProductCategory } from '@/types';
import { subscribeToProducts, INITIAL_SAMPLE_PRODUCTS } from '@/services/productService';
import { DEFAULT_WHATSAPP_NUMBER } from '@/utils/whatsapp';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';

// Lazy-load the hidden admin component so no admin code or data is bundled in initial load
const AdminWrapper = lazy(() => import('@/components/admin/AdminWrapper'));

const SECRET_ADMIN_ROUTE = '/x-cm-7k2q9';

function getInitialRoute(): 'home' | 'products' | 'contact' | 'admin' | '404' {
  if (typeof window === 'undefined') return 'home';

  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const hash = window.location.hash.replace('#', '').replace(/\/+$/, '');

  if (pathname === SECRET_ADMIN_ROUTE || hash === 'x-cm-7k2q9' || hash === '/x-cm-7k2q9') {
    return 'admin';
  }

  if (pathname === '/' || pathname === '') {
    return 'home';
  }

  if (pathname === '/products') {
    return 'products';
  }

  if (pathname === '/contact') {
    return 'contact';
  }

  // Any other unknown route (/admin, /login, /dashboard, etc.) returns 404
  return '404';
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<'home' | 'products' | 'contact' | 'admin' | '404'>(getInitialRoute);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sync with browser URL changes
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getInitialRoute());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Real-time Firestore subscription to products collection
  useEffect(() => {
    const unsubscribe = subscribeToProducts(
      (loadedProducts) => {
        if (loadedProducts.length > 0) {
          setProducts(loadedProducts);
        } else {
          // If Firestore collection is empty, display initial sample products on public view
          const sampleList: Product[] = INITIAL_SAMPLE_PRODUCTS.map((p, idx) => ({
            id: `sample-${idx + 1}`,
            ...p,
          }));
          setProducts(sampleList);
        }
        setLoadingProducts(false);
      },
      (err) => {
        console.warn('Public products subscription fallback to samples:', err);
        const sampleList: Product[] = INITIAL_SAMPLE_PRODUCTS.map((p, idx) => ({
          id: `sample-${idx + 1}`,
          ...p,
        }));
        setProducts(sampleList);
        setLoadingProducts(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const navigateTo = (route: 'home' | 'products' | 'contact' | 'admin' | '404') => {
    setCurrentRoute(route);
    let targetPath = '/';
    if (route === 'products') targetPath = '/products';
    else if (route === 'contact') targetPath = '/contact';
    else if (route === 'admin') targetPath = SECRET_ADMIN_ROUTE;
    else if (route === '404') targetPath = window.location.pathname;

    window.history.pushState({}, '', targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Triggered when user taps the footer logo 7 times quickly
  const handleSecretAdminTrigger = () => {
    navigateTo('admin');
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    navigateTo('products');
  };

  // If currently on secret admin route, render lazy AdminWrapper
  if (currentRoute === 'admin') {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-black flex items-center justify-center text-white">
            <Loader2 className="w-8 h-8 text-[#1E6FD9] animate-spin mb-2" />
          </div>
        }
      >
        <AdminWrapper onExitToStore={() => navigateTo('home')} />
      </Suspense>
    );
  }

  // If on an unknown route (/admin, /login, /dashboard, etc.), show clean 404
  if (currentRoute === '404') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar
          currentTab="home"
          setCurrentTab={() => navigateTo('home')}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <main className="flex-1">
          <NotFoundView onGoHome={() => navigateTo('home')} />
        </main>
        <Footer
          onSecretAdminTrigger={handleSecretAdminTrigger}
          onNavigateTab={navigateTo}
        />
      </div>
    );
  }

  // New arrivals (first 4 items)
  const newArrivals = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-[#1E6FD9] selection:text-white">
      {/* Navbar */}
      <Navbar
        currentTab={currentRoute}
        setCurrentTab={(tab) => navigateTo(tab)}
        onSelectCategory={handleSelectCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Pages */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <>
            {/* Hero Section */}
            <Hero onExploreProducts={() => navigateTo('products')} />

            {/* Category Cards (Phones, Accessories, Chargers & Cables, Cases & Screen Protectors) */}
            <CategoryCards onSelectCategory={handleSelectCategory} />

            {/* "New arrivals" row */}
            <section className="py-12 sm:py-16 bg-black border-t border-zinc-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E6FD9] tracking-wider uppercase mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Fresh In Store</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      New Arrivals
                    </h2>
                  </div>

                  <button
                    onClick={() => navigateTo('products')}
                    className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1E6FD9] hover:text-[#3e8df3] transition-colors"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                  {newArrivals.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOpenDetails={(p) => setSelectedProduct(p)}
                      whatsappNumber={DEFAULT_WHATSAPP_NUMBER}
                    />
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {currentRoute === 'products' && (
          <ProductsView
            products={products}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenDetails={(p) => setSelectedProduct(p)}
            whatsappNumber={DEFAULT_WHATSAPP_NUMBER}
          />
        )}

        {currentRoute === 'contact' && <ContactView />}
      </main>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          whatsappNumber={DEFAULT_WHATSAPP_NUMBER}
        />
      )}

      {/* Floating WhatsApp Quick Action Button */}
      <WhatsAppFloating whatsappNumber={DEFAULT_WHATSAPP_NUMBER} />

      {/* Footer with 7-tap Secret Admin Entrance */}
      <Footer
        onSecretAdminTrigger={handleSecretAdminTrigger}
        onSelectCategory={handleSelectCategory}
        onNavigateTab={navigateTo}
      />
    </div>
  );
}
