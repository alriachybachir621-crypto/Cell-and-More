import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, Loader2, Check, AlertCircle } from 'lucide-react';
import { Product, ProductCategory } from '@/types';
import { resizeImageToBase64 } from '@/utils/imageResize';

interface ProductFormModalProps {
  initialProduct?: Product | null;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
}

const CATEGORIES: ProductCategory[] = [
  'Phones',
  'Accessories',
  'Chargers & Cables',
  'Cases & Screen Protectors',
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  initialProduct,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(initialProduct);

  const [name, setName] = useState(initialProduct?.name || '');
  const [price, setPrice] = useState(initialProduct ? initialProduct.price.toString() : '');
  const [category, setCategory] = useState<ProductCategory>(initialProduct?.category || 'Phones');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [inStock, setInStock] = useState<boolean>(initialProduct ? initialProduct.inStock : true);
  const [imageUrl, setImageUrl] = useState<string>(initialProduct?.imageUrl || '');

  const [imageProcessing, setImageProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageProcessing(true);
    setErrorMessage(null);

    try {
      // Resize to max 800px and compress to JPEG ~0.7
      const base64Data = await resizeImageToBase64(file, 800, 0.7);
      setImageUrl(base64Data);
    } catch (err: any) {
      console.error('Image processing error:', err);
      setErrorMessage('Failed to process image. Please choose another JPG/PNG file.');
    } finally {
      setImageProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setErrorMessage('Please enter a valid price in USD.');
      return;
    }

    if (!imageUrl) {
      setErrorMessage('Please upload a product photo or provide an image.');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        price: parsedPrice,
        category,
        description: description.trim(),
        imageUrl,
        inStock,
      });
      onClose();
    } catch (err: any) {
      console.error('Error saving product:', err);
      setErrorMessage(err?.message || 'Failed to save product. Please check connection.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/50">
          <div>
            <h2 className="text-lg font-bold text-white">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-xs text-zinc-400">
              {isEditing ? 'Update specifications, pricing, or stock status' : 'Fill in the details to add an item to the catalog'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. iPhone 16 Pro Max 256GB"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#1E6FD9] transition-colors"
            />
          </div>

          {/* Price & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Price (USD) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">$</span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="250"
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#1E6FD9] transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#1E6FD9] transition-colors cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Specifications, features, color, storage, compatibility..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#1E6FD9] transition-colors resize-none"
            />
          </div>

          {/* In Stock Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-zinc-900/60 border border-zinc-850 rounded-xl">
            <div>
              <span className="text-xs font-bold text-white block">Stock Availability</span>
              <span className="text-[11px] text-zinc-400">
                {inStock ? 'Item is available for immediate customer purchase' : 'Mark as Out of Stock in catalog'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setInStock(!inStock)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                inStock ? 'bg-emerald-500' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  inStock ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Image Upload (Browser-side resize max 800px, JPEG 0.7, no Firebase Storage) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Product Photo (Auto-compressed to max 800px JPEG) *
            </label>

            {imageUrl ? (
              <div className="flex items-center gap-4 p-3 bg-zinc-900/70 border border-zinc-800 rounded-2xl">
                <div className="w-20 h-20 bg-black rounded-xl overflow-hidden border border-zinc-700 flex-shrink-0 flex items-center justify-center">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Photo ready & optimized
                  </span>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Compressed client-side. No cloud storage bucket required.
                  </p>
                  <label className="mt-2 inline-block text-xs text-[#1E6FD9] hover:underline cursor-pointer font-medium">
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-zinc-800 hover:border-[#1E6FD9] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-zinc-900/30 group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {imageProcessing ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-[#1E6FD9] animate-spin" />
                    <span className="text-xs text-zinc-400">Optimizing image to 800px JPEG...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 group-hover:bg-[#1E6FD9]/20 text-zinc-400 group-hover:text-[#1E6FD9] flex items-center justify-center transition-colors">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white group-hover:text-[#1E6FD9]">
                        Click to upload photo
                      </span>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        JPEG, PNG, or WebP. Automatically resized & compressed.
                      </p>
                    </div>
                  </div>
                )}
              </label>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || imageProcessing || !name.trim() || !price || !imageUrl}
              className="px-6 py-2.5 rounded-xl bg-[#1E6FD9] hover:bg-[#185cb4] disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#1E6FD9]/25 transition-all"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Catalog...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes' : 'Publish Product'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
