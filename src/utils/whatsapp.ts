import { Product } from '@/types';

export const DEFAULT_WHATSAPP_NUMBER = '96170889900';
export const DEFAULT_WHATSAPP_DISPLAY = '+961 70 889 900';
export const DEFAULT_FACEBOOK_URL = 'https://www.facebook.com';
export const DEFAULT_SHOP_ADDRESS = 'Main Highway, Lebanon (Delivery available across Lebanon)';

export function generateProductWhatsAppUrl(
  product: Product,
  whatsappNumber: string = DEFAULT_WHATSAPP_NUMBER
): string {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://cellandmore.app';
  // Include product name, price in USD, and current page link
  const message = `Hello Cell and More! 📱\nI would like to order:\n\n*${product.name}*\nPrice: $${product.price.toLocaleString()} USD\nProduct Link: ${currentUrl}\n\nPlease confirm availability and delivery details across Lebanon. Thank you!`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function generateGeneralInquiryWhatsAppUrl(
  whatsappNumber: string = DEFAULT_WHATSAPP_NUMBER,
  inquiry: string = 'Hello Cell and More! I have an inquiry about mobile phones and accessories.'
): string {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(inquiry)}`;
}
