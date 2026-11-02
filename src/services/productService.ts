import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '@/firebase/config';
import { handleFirestoreError, OperationType } from '@/firebase/errors';
import { Product, ProductCategory, AdminConfigDoc } from '@/types';

const PRODUCTS_COLLECTION = 'products';
const CONFIG_ADMIN_PATH = 'config/admin';

export const INITIAL_SAMPLE_PRODUCTS: Omit<Product, 'id'>[] = [
  {
    name: 'iPhone 16 Pro Max 256GB - Desert Titanium',
    price: 1280,
    category: 'Phones',
    description: 'Apple A18 Pro chip, 48MP Fusion camera system, Grade 5 Titanium design with textured matte glass back, Action button and Camera Control.',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    featured: true,
  },
  {
    name: 'Samsung Galaxy S24 Ultra 512GB - Titanium Black',
    price: 1150,
    category: 'Phones',
    description: 'Galaxy AI built-in, 200MP camera with 100x Space Zoom, Snapdragon 8 Gen 3 for Galaxy, built-in S Pen, and flat 6.8" Dynamic AMOLED 2X display.',
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    featured: true,
  },
  {
    name: 'iPhone 15 128GB - Black',
    price: 740,
    category: 'Phones',
    description: 'Dynamic Island, 48MP main camera with 2x Telephoto, color-infused back glass with aluminum frame, USB-C connector.',
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    featured: true,
  },
  {
    name: 'Xiaomi 14T Pro 512GB - Titan Gray',
    price: 690,
    category: 'Phones',
    description: 'Leica optical Summilux lens, MediaTek Dimensity 9300+ flagship chipset, 120W HyperCharge wired & 50W wireless charging.',
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    featured: false,
  },
  {
    name: 'Apple AirPods Pro (2nd Generation) with MagSafe USB-C',
    price: 240,
    category: 'Accessories',
    description: 'Up to 2x more Active Noise Cancellation, Adaptive Audio, Transparency mode, Personalized Spatial Audio with dynamic head tracking.',
    imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    featured: true,
  },
  {
    name: 'JBL Flip 6 Portable Waterproof Bluetooth Speaker',
    price: 115,
    category: 'Accessories',
    description: '2-way speaker system with racetrack-shaped woofer, separate tweeter, IP67 waterproof and dustproof, up to 12 hours of playtime.',
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    featured: false,
  },
  {
    name: 'Baseus 10,000mAh Magnetic Wireless Power Bank 20W',
    price: 38,
    category: 'Accessories',
    description: 'Ultra-strong magnet alignment for MagSafe iPhones, LED battery level display, 20W PD USB-C fast charging, pocket portable.',
    imageUrl: 'https://images.unsplash.com/photo-1609592426508-410a70f5e1f0?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    featured: false,
  },
  {
    name: 'Anker 65W GaN Fast Charger 3-Port (2x USB-C + USB-A)',
    price: 45,
    category: 'Chargers & Cables',
    description: 'PowerIQ 3.0 ultra-compact wall charger. Charge a MacBook, iPhone, and AirPods simultaneously with high-speed Gallium Nitride efficiency.',
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    featured: false,
  },
  {
    name: 'Samsung 45W Super Fast Wall Charger with 5A Type-C Cable',
    price: 32,
    category: 'Chargers & Cables',
    description: 'Original Samsung 45W Power Adapter with USB Type-C to Type-C 5A high-current cable for Galaxy S24 Ultra, S23+, and Tablets.',
    imageUrl: 'https://images.unsplash.com/photo-1622445268045-847255959952?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    featured: false,
  },
  {
    name: 'Belkin BoostCharge Braided USB-C to USB-C Cable (2m / 6.6ft)',
    price: 18,
    category: 'Chargers & Cables',
    description: 'Double-braided nylon exterior tested to withstand 25,000+ bends, supports up to 60W USB-PD fast charging and sync.',
    imageUrl: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    featured: false,
  },
  {
    name: 'Spigen Ultra Hybrid MagFit Case for iPhone 16 Pro',
    price: 28,
    category: 'Cases & Screen Protectors',
    description: 'Crystal-clear shock-absorbing back with Air Cushion Technology on corners. Built-in magnetic ring for full MagSafe compatibility.',
    imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    featured: false,
  },
  {
    name: 'Remax 9D Privacy Edge-to-Edge Tempered Glass',
    price: 12,
    category: 'Cases & Screen Protectors',
    description: '28-degree two-way privacy filter prevents prying eyes from side angles. 9H hardness oleophobic anti-fingerprint coating with seamless rounded edges.',
    imageUrl: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80',
    inStock: false,
    featured: false,
  },
];

/**
 * Subscribe to products collection in real time.
 */
export function subscribeToProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const products: Product[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Product, 'id'>),
      }));
      onUpdate(products);
    },
    (err) => {
      console.error('Error fetching products:', err);
      if (onError) onError(err);
      handleFirestoreError(err, OperationType.LIST, PRODUCTS_COLLECTION);
    }
  );
}

/**
 * Add a new product to Firestore.
 */
export async function addProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...productData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, PRODUCTS_COLLECTION);
  }
}

/**
 * Update an existing product.
 */
export async function updateProduct(
  productId: string,
  updates: Partial<Omit<Product, 'id' | 'createdAt'>>
): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${productId}`;
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Toggle in-stock status quickly with one tap.
 */
export async function toggleProductStock(productId: string, currentStatus: boolean): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${productId}`;
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(docRef, { inStock: !currentStatus });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Delete a product.
 */
export async function deleteProduct(productId: string): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${productId}`;
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Seed initial sample products if collection is empty.
 */
export async function seedInitialProductsIfEmpty(): Promise<boolean> {
  try {
    const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (snapshot.empty) {
      for (const prod of INITIAL_SAMPLE_PRODUCTS) {
        await addDoc(collection(db, PRODUCTS_COLLECTION), {
          ...prod,
          createdAt: serverTimestamp(),
        });
      }
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Seed operation check:', error);
    return false;
  }
}

/**
 * Force re-seed sample products (Admin action)
 */
export async function forceSeedSampleProducts(): Promise<void> {
  try {
    for (const prod of INITIAL_SAMPLE_PRODUCTS) {
      await addDoc(collection(db, PRODUCTS_COLLECTION), {
        ...prod,
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, PRODUCTS_COLLECTION);
  }
}

/**
 * Check if the admin config document exists in Firestore.
 */
export async function checkAdminConfigExists(): Promise<boolean> {
  try {
    const adminDocRef = doc(db, 'config', 'admin');
    const snap = await getDoc(adminDocRef);
    return snap.exists();
  } catch (error: any) {
    // If permission-denied is thrown, that means config/admin already exists and is locked down!
    if (error?.code === 'permission-denied' || String(error).includes('permission-denied')) {
      return true;
    }
    return false;
  }
}

/**
 * Create initial admin config document.
 */
export async function createAdminConfig(adminUid: string, email: string): Promise<void> {
  try {
    const adminDocRef = doc(db, 'config', 'admin');
    await setDoc(adminDocRef, {
      adminUid,
      email,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, CONFIG_ADMIN_PATH);
  }
}
