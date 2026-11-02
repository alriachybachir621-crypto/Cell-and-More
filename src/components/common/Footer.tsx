import React, { useState, useRef } from 'react';
import { MessageCircle, MapPin, Phone, ShieldCheck, Truck, Clock } from 'lucide-react';
import { DEFAULT_WHATSAPP_NUMBER, DEFAULT_WHATSAPP_DISPLAY, DEFAULT_FACEBOOK_URL, DEFAULT_SHOP_ADDRESS, generateGeneralInquiryWhatsAppUrl } from '@/utils/whatsapp';

interface FooterProps {
  onSecretAdminTrigger: () => void;
  onSelectCategory?: (category: string) => void;
  onNavigateTab: (tab: 'home' | 'products' | 'contact') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSecretAdminTrigger,
  onSelectCategory,
  onNavigateTab,
}) => {
  const [tapCount, setTapCount] = useState(0);
  const lastTapRef = useRef<number>(0);

  // Hidden 7-tap detector on the footer logo
  const handleLogoTap = () => {
    const now = Date.now();
    const timeDiff = now - lastTapRef.current;
    lastTapRef.current = now;

    if (timeDiff < 800) {
      const nextCount = tapCount + 1;
      setTapCount(nextCount);
      if (nextCount >= 7) {
        setTapCount(0);
        onSecretAdminTrigger();
      }
    } else {
      setTapCount(1);
    }
  };

  return (
    <footer className="bg-black border-t border-zinc-900 text-zinc-400 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value props banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-12 border-b border-zinc-900">
          <div className="flex items-center gap-3 bg-zinc-950/60 border border-zinc-900 p-4 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-[#1E6FD9]/10 text-[#1E6FD9] flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Lebanon-Wide Delivery</h4>
              <p className="text-xs text-zinc-500">Fast delivery straight to your doorstep</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-zinc-950/60 border border-zinc-900 p-4 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-[#1E6FD9]/10 text-[#1E6FD9] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">100% Genuine Tech</h4>
              <p className="text-xs text-zinc-500">Original phones, chargers & accessories</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-zinc-950/60 border border-zinc-900 p-4 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">WhatsApp Direct Support</h4>
              <p className="text-xs text-zinc-500">Quick answers & order confirmation</p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          {/* Brand info with secret tap target */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleLogoTap}
                className="w-12 h-12 rounded-full overflow-hidden border border-[#1E6FD9]/40 bg-zinc-900 flex-shrink-0 active:scale-95 transition-transform select-none cursor-default"
                title="Cell and More"
                aria-label="Cell and More logo"
              >
                <img
                  src="/logo-transparent.png"
                  alt="Cell and More"
                  className="w-full h-full object-cover pointer-events-none"
                />
              </button>
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight">
                  Cell <span className="text-[#1E6FD9]">&</span> More
                </span>
                <p className="text-xs text-zinc-400">Mobile Phone & Accessories Shop in Lebanon</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed">
              Your trusted shop for the latest mobile phones, certified chargers, heavy-duty drop-proof cases, and high-fidelity tech accessories. Delivery available across all Lebanese regions.
            </p>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-3">Categories</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => {
                    onSelectCategory?.('Phones');
                    onNavigateTab('products');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Phones & Smart Devices
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory?.('Accessories');
                    onNavigateTab('products');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Audio & Accessories
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory?.('Chargers & Cables');
                    onNavigateTab('products');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Fast Chargers & Cables
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory?.('Cases & Screen Protectors');
                    onNavigateTab('products');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Cases & Screen Protectors
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-3">Reach Us</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#1E6FD9] flex-shrink-0 mt-0.5" />
                <span>{DEFAULT_SHOP_ADDRESS}</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366] flex-shrink-0" />
                <a
                  href={generateGeneralInquiryWhatsAppUrl(DEFAULT_WHATSAPP_NUMBER)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white text-[#25D366] transition-colors font-medium"
                >
                  {DEFAULT_WHATSAPP_DISPLAY}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                <span>Mon – Sat: 9:00 AM – 8:00 PM</span>
              </li>
              <li className="pt-2">
                <a
                  href={DEFAULT_FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
                >
                  <span>Facebook Official Page</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-600 gap-4">
          <p>© {new Date().getFullYear()} Cell and More. All rights reserved.</p>
          <p className="text-zinc-500">Premium Tech in Lebanon • Direct WhatsApp Ordering</p>
        </div>
      </div>
    </footer>
  );
};
