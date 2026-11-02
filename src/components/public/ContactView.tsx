import React from 'react';
import { MessageCircle, MapPin, Facebook, Clock, Phone, Send, CheckCircle, Shield } from 'lucide-react';
import {
  DEFAULT_WHATSAPP_NUMBER,
  DEFAULT_WHATSAPP_DISPLAY,
  DEFAULT_FACEBOOK_URL,
  DEFAULT_SHOP_ADDRESS,
  generateGeneralInquiryWhatsAppUrl,
} from '@/utils/whatsapp';

export const ContactView: React.FC = () => {
  return (
    <div className="py-10 sm:py-16 bg-black min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-[#1E6FD9]/15 text-[#1E6FD9] border border-[#1E6FD9]/30 text-xs font-bold tracking-wider uppercase mb-3">
            Get in Touch
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Contact Cell & More
          </h1>
          <p className="mt-3 text-sm sm:text-base text-zinc-400">
            Have questions about smartphone availability, accessory compatibility, or delivery anywhere in Lebanon? Reach out to us directly!
          </p>
        </div>

        {/* Primary Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* WhatsApp Card */}
          <div className="flex flex-col bg-zinc-950 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden group hover:border-[#25D366] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mb-5">
              <MessageCircle className="w-6 h-6 fill-current" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">WhatsApp Chat</h3>
            <p className="text-xs text-zinc-400 mb-4 flex-1">
              Instant response for orders, price checks, product photos, and delivery tracking.
            </p>
            <div className="text-sm font-bold text-white mb-4">
              {DEFAULT_WHATSAPP_DISPLAY}
            </div>
            <a
              href={generateGeneralInquiryWhatsAppUrl(DEFAULT_WHATSAPP_NUMBER)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1fbe58] text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#25D366]/20 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              <span>Open WhatsApp</span>
            </a>
          </div>

          {/* Facebook Official Page */}
          <div className="flex flex-col bg-zinc-950 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden group hover:border-[#1E6FD9] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#1E6FD9]/10 text-[#1E6FD9] flex items-center justify-center mb-5">
              <Facebook className="w-6 h-6 fill-current" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Facebook Page</h3>
            <p className="text-xs text-zinc-400 mb-4 flex-1">
              Follow our latest product unboxings, new arrivals announcements, and special flash offers.
            </p>
            <div className="text-sm font-bold text-white mb-4">
              Cell and More
            </div>
            <a
              href={DEFAULT_FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-[#1E6FD9] hover:bg-[#185cb4] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#1E6FD9]/20 active:scale-95"
            >
              <Facebook className="w-4 h-4 fill-white" />
              <span>Visit Facebook Page</span>
            </a>
          </div>

          {/* Shop Location */}
          <div className="flex flex-col bg-zinc-950 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden group hover:border-zinc-600 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-zinc-300 flex items-center justify-center mb-5">
              <MapPin className="w-6 h-6 text-[#1E6FD9]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Store Location</h3>
            <p className="text-xs text-zinc-400 mb-4 flex-1">
              Visit our store or request rapid delivery to your address anywhere in Lebanon.
            </p>
            <div className="text-xs sm:text-sm font-medium text-zinc-200 mb-4">
              {DEFAULT_SHOP_ADDRESS}
            </div>
            <div className="mt-auto flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-850">
              <Clock className="w-4 h-4 text-[#1E6FD9] flex-shrink-0" />
              <span>Mon – Sat: 9:00 AM – 8:00 PM</span>
            </div>
          </div>
        </div>

        {/* Delivery & Ordering FAQ */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
            How to order from Cell and More?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm text-zinc-400">
            <div className="space-y-1">
              <div className="text-white font-bold flex items-center gap-1.5 mb-1">
                <span className="w-5 h-5 rounded-full bg-[#1E6FD9] text-white text-xs flex items-center justify-center font-bold">1</span>
                <span>Select Your Items</span>
              </div>
              <p>Browse our catalog of phones and accessories, or send us the model you are looking for.</p>
            </div>

            <div className="space-y-1">
              <div className="text-white font-bold flex items-center gap-1.5 mb-1">
                <span className="w-5 h-5 rounded-full bg-[#1E6FD9] text-white text-xs flex items-center justify-center font-bold">2</span>
                <span>Click WhatsApp Order</span>
              </div>
              <p>The pre-filled message will send the product name, price, and link directly to our WhatsApp chat.</p>
            </div>

            <div className="space-y-1">
              <div className="text-white font-bold flex items-center gap-1.5 mb-1">
                <span className="w-5 h-5 rounded-full bg-[#1E6FD9] text-white text-xs flex items-center justify-center font-bold">3</span>
                <span>Delivery to your Door</span>
              </div>
              <p>Our courier delivers across all cities and regions of Lebanon. Cash on delivery in USD or LBP at market rate.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
