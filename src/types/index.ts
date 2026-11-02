export type ProductCategory = 
  | 'Phones' 
  | 'Accessories' 
  | 'Chargers & Cables' 
  | 'Cases & Screen Protectors';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  description: string;
  imageUrl: string;
  inStock: boolean;
  createdAt?: any;
  featured?: boolean;
}

export interface StoreSettings {
  whatsappNumber: string; // e.g., '96170123456'
  whatsappDisplay: string; // e.g., '+961 70 123 456'
  facebookUrl: string;
  shopAddress: string;
  openingHours: string;
  tagline: string;
}

export interface AdminConfigDoc {
  adminUid: string;
  email: string;
  createdAt: any;
}
