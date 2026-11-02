import React from 'react';
import { MessageCircle, Facebook, Clock, Send, ShieldCheck, Sparkles } from 'lucide-react';
import {
  DEFAULT_WHATSAPP_NUMBER,
  DEFAULT_WHATSAPP_DISPLAY,
  DEFAULT_FACEBOOK_URL,
  generateGeneralInquiryWhatsAppUrl,
} from '@/utils/whatsapp';

export const ContactView: React.FC = () => {
  return (
    <div className="py-10 sm:py-16 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-block px-3 py-1 rounded-full bg-[#1E6FD9]/15 text-[#1E6FD9] border border-[#1E6FD9]/30 text-xs font-bold tracking-wider uppercase mb-3">
            Get in Touch
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Contact Cell & More
          </h1>
          <p className="mt-3 text-sm sm:text-base text-zinc-400">
            Have questions about smartphone models, accessories, or delivery? Reach out to us directly through WhatsApp or Facebook!
          </p>
        </div>

        {/* Primary Contact Cards Grid - WhatsApp and Facebook ONLY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {/* WhatsApp Card */}
          <div className="flex flex-col bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden group hover:border-[#25D366] transition-all shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mb-5">
              <MessageCircle className="w-7 h-7 fill-current" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1.5">WhatsApp Direct Chat</h3>
            <p className="text-xs sm:text-sm text-zinc-400 mb-6 flex-1">
              Instant customer support for instant order inquiries, price quotes, product availability, and tracking.
            </p>
            <div className="text-base sm:text-lg font-mono font-bold text-white mb-5 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse"></span>
              <span>{DEFAULT_WHATSAPP_DISPLAY}</span>
            </div>
            <a
              href="https://wa.me/96171109298"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#1fbe58] text-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-[#25D366]/25 active:scale-95"
            >
              <MessageCircle className="w-5 h-5 fill-black" />
              <span>Order & Chat on WhatsApp</span>
            </a>
          </div>

          {/* Facebook Official Page */}
          <div className="flex flex-col bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden group hover:border-[#1E6FD9] transition-all shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-[#1E6FD9]/10 text-[#1E6FD9] flex items-center justify-center mb-5">
              <Facebook className="w-7 h-7 fill-current" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1.5">Facebook Official Page</h3>
            <p className="text-xs sm:text-sm text-zinc-400 mb-6 flex-1">
              Check out our latest product arrivals, tech updates, unboxings, reviews, and flash promotions.
            </p>
            <div className="text-base sm:text-lg font-bold text-white mb-5 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E6FD9]"></span>
              <span>Cell and More</span>
            </div>
            <a
              href={DEFAULT_FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-5 rounded-2xl bg-[#1E6FD9] hover:bg-[#185cb4] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-[#1E6FD9]/25 active:scale-95"
            >
              <Facebook className="w-5 h-5 fill-white" />
              <span>Visit us on Facebook</span>
            </a>
          </div>
        </div>

        {/* Operating Hours and Delivery Info (No physical address/location/map) */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-2.5 mb-6">
            <Clock className="w-5 h-5 text-[#1E6FD9]" />
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Customer Support Hours & Ordering
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm text-zinc-400">
            <div className="space-y-1.5 bg-zinc-900/40 p-4 rounded-2xl border border-zinc-850">
              <div className="text-white font-bold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1E6FD9]/20 text-[#1E6FD9] text-xs flex items-center justify-center font-bold">1</span>
                <span>Select Your Items</span>
              </div>
              <p className="text-zinc-400">Browse phones, accessories, chargers, and cases from our catalog.</p>
            </div>

            <div className="space-y-1.5 bg-zinc-900/40 p-4 rounded-2xl border border-zinc-850">
              <div className="text-white font-bold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1E6FD9]/20 text-[#1E6FD9] text-xs flex items-center justify-center font-bold">2</span>
                <span>One-Tap WhatsApp</span>
              </div>
              <p className="text-zinc-400">Send pre-filled message with product name, price, and link directly to our WhatsApp.</p>
            </div>

            <div className="space-y-1.5 bg-zinc-900/40 p-4 rounded-2xl border border-zinc-850">
              <div className="text-white font-bold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1E6FD9]/20 text-[#1E6FD9] text-xs flex items-center justify-center font-bold">3</span>
                <span>Fast Delivery</span>
              </div>
              <p className="text-zinc-400">Delivery service across Lebanon. Support team active Monday to Saturday: 9:00 AM – 8:00 PM.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
