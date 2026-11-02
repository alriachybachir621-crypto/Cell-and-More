import React from 'react';
import { MessageCircle, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Product } from '@/types';
import { generateProductWhatsAppUrl } from '@/utils/whatsapp';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  whatsappNumber?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  whatsappNumber,
}) => {
  const whatsappUrl = generateProductWhatsAppUrl(product, whatsappNumber);

  return (
    <div className="group flex flex-col bg-zinc-950 border border-zinc-800/80 hover:border-[#1E6FD9]/80 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_4px_24px_rgba(30,111,217,0.15)] transform hover:-translate-y-1">
      {/* Product Image Box */}
      <div
        onClick={() => onOpenDetails(product)}
        className="relative w-full aspect-square bg-zinc-900 overflow-hidden cursor-pointer flex items-center justify-center"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            !product.inStock ? 'opacity-50 grayscale' : ''
          }`}
          onError={(e) => {
            // Fallback placeholder if image fails to load
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Stock Badge Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.inStock ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              In Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-rose-950/90 text-rose-300 border border-rose-800 backdrop-blur-md">
              <AlertCircle className="w-3 h-3" />
              Out of Stock
            </span>
          )}
        </div>

        {/* Category Pill */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide bg-black/70 text-zinc-300 border border-zinc-800 backdrop-blur-md">
            {product.category}
          </span>
        </div>

        {/* Hover quick view overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-3.5 py-1.5 rounded-full bg-black/80 text-white text-xs font-semibold border border-zinc-700 flex items-center gap-1.5 backdrop-blur-sm">
            <ExternalLink className="w-3.5 h-3.5" />
            View Details
          </span>
        </div>
      </div>

      {/* Product Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <h3
          onClick={() => onOpenDetails(product)}
          className="text-sm sm:text-base font-bold text-white group-hover:text-[#1E6FD9] transition-colors line-clamp-2 cursor-pointer leading-snug"
          title={product.name}
        >
          {product.name}
        </h3>

        <p className="mt-1.5 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price & Action Row */}
        <div className="mt-auto pt-4 flex items-center justify-between gap-2 border-t border-zinc-900">
          <div>
            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider block">
              Price
            </span>
            <span className="text-base sm:text-lg font-black text-white tracking-tight">
              ${product.price.toLocaleString()} <span className="text-xs font-normal text-zinc-400">USD</span>
            </span>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
              product.inStock
                ? 'bg-[#25D366] hover:bg-[#1fbe58] text-black shadow-md shadow-[#25D366]/20'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
            }`}
            title="Order directly on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>Order</span>
          </a>
        </div>
      </div>
    </div>
  );
};
