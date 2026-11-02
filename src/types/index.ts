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
  whatsappNumber: string;
  whatsappDisplay: string;
  facebookUrl: string;
  openingHours: string;
  tagline: string;
}

export interface AdminConfigDoc {
  adminUid: string;
  email: string;
  createdAt: any;
}
