import React from 'react';
import { ArrowRight, MessageCircle, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { DEFAULT_WHATSAPP_NUMBER, generateGeneralInquiryWhatsAppUrl } from '@/utils/whatsapp';

interface HeroProps {
  onExploreProducts: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreProducts }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-zinc-900 bg-gradient-to-b from-zinc-950 via-black to-black">
      {/* Tech Grid Background & Glow Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(#1E6FD9_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#1E6FD9]/15 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Brand Logo with Glow */}
        <div className="inline-block relative mb-6">
          <div className="absolute inset-0 bg-[#1E6FD9] rounded-full blur-xl opacity-30 animate-pulse"></div>
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 mx-auto rounded-full p-1 bg-gradient-to-b from-[#1E6FD9] via-zinc-800 to-black shadow-2xl">
            <img
              src="/logo-transparent.png"
              alt="Cell and More Logo"
              className="w-full h-full object-cover rounded-full bg-black"
            />
          </div>
        </div>

        {/* Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-700/60 text-[#1E6FD9] text-xs sm:text-sm font-semibold mb-6 shadow-inner">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mobile Phones & Tech Accessories in Lebanon</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight sm:leading-none">
          Smart Devices. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-[#1E6FD9]">
            Certified Accessories.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          The latest smartphones from Apple, Samsung, Xiaomi, alongside high-speed GaN chargers, rugged MagSafe cases, and audio gear with express Lebanon delivery.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
          <button
            onClick={onExploreProducts}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#1E6FD9] hover:bg-[#185cb4] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#1E6FD9]/25 flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={generateGeneralInquiryWhatsAppUrl(DEFAULT_WHATSAPP_NUMBER)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
            <span>Order on WhatsApp</span>
          </a>
        </div>

        {/* Feature Badges */}
        <div className="mt-12 pt-8 border-t border-zinc-900/80 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-xs text-zinc-400">
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-[#1E6FD9]" />
            <span>Fast Delivery in Lebanon</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1E6FD9]" />
            <span>100% Genuine Products</span>
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>Direct WhatsApp Help</span>
          </div>
        </div>
      </div>
    </section>
  );
};
