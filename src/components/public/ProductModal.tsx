import React, { useState } from 'react';
import { X, MessageCircle, Share2, Check, AlertCircle, Shield, Truck, CornerDownRight } from 'lucide-react';
import { Product } from '@/types';
import { generateProductWhatsAppUrl, DEFAULT_WHATSAPP_NUMBER } from '@/utils/whatsapp';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  whatsappNumber?: string;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  whatsappNumber = DEFAULT_WHATSAPP_NUMBER,
}) => {
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const whatsappUrl = generateProductWhatsAppUrl(product, whatsappNumber);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog Box */}
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-zinc-400 hover:text-white border border-zinc-700 backdrop-blur-md transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Photo Section */}
        <div className="w-full md:w-1/2 bg-black relative flex items-center justify-center min-h-[260px] md:min-h-[420px] p-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`w-full max-h-[380px] object-contain rounded-2xl ${
              !product.inStock ? 'opacity-60 grayscale' : ''
            }`}
          />
          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="px-4 py-2 rounded-full bg-rose-950 border border-rose-800 text-rose-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xl">
                <AlertCircle className="w-4 h-4" />
                Currently Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Details & WhatsApp Order Section */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col overflow-y-auto">
          {/* Category & Status */}
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#1E6FD9]/15 text-[#1E6FD9] border border-[#1E6FD9]/30">
              {product.category}
            </span>
            {product.inStock ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                In Stock & Ready for Delivery
              </span>
            ) : (
              <span className="text-rose-400 text-xs font-semibold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Out of Stock
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
            {product.name}
          </h2>

          {/* Price */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">
              ${product.price.toLocaleString()}
            </span>
            <span className="text-sm font-medium text-zinc-400">USD</span>
          </div>

          {/* Description */}
          <div className="mt-4 pt-4 border-t border-zinc-900">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Overview & Specifications
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
              {product.description || 'Genuine original device with official manufacturer warranty and specifications.'}
            </p>
          </div>

          {/* Guarantee Badges */}
          <div className="mt-6 pt-4 border-t border-zinc-900 space-y-2 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#1E6FD9]" />
              <span>Fast courier delivery across Lebanon</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#1E6FD9]" />
              <span>Checked and inspected before dispatch</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-4 flex flex-col gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5b] text-black font-extrabold text-sm sm:text-base shadow-xl shadow-[#25D366]/20 transition-all active:scale-95"
            >
              <MessageCircle className="w-5 h-5 fill-black" />
              <span>Order on WhatsApp</span>
            </a>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Copy Product Link</span>
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="py-2.5 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 text-xs font-semibold transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
