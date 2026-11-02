import React from 'react';
import { MessageCircle } from 'lucide-react';
import { DEFAULT_WHATSAPP_NUMBER, generateGeneralInquiryWhatsAppUrl } from '@/utils/whatsapp';

interface WhatsAppFloatingProps {
  whatsappNumber?: string;
}

export const WhatsAppFloating: React.FC<WhatsAppFloatingProps> = ({
  whatsappNumber = DEFAULT_WHATSAPP_NUMBER,
}) => {
  return (
    <aside aria-label="WhatsApp quick chat" className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Tooltip on hover/touch */}
      <span className="hidden sm:inline-block mr-3 px-3 py-1.5 bg-zinc-900/90 text-white text-xs font-semibold rounded-xl border border-zinc-700 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Order or chat on WhatsApp
      </span>

      {/* Floating Action Button */}
      <a
        href={generateGeneralInquiryWhatsAppUrl(whatsappNumber)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-lg shadow-[#25D366]/30 active:scale-95 transition-all transform hover:-translate-y-1"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-[#1E6FD9] border-2 border-black"></span>
        </span>
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>
    </aside>
  );
};
