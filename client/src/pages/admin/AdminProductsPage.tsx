import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Upload,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { api } from '../../services/api';
import { Product, Category } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminProductsPage: React.FC = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | string>(399);
  const [comparePrice, setComparePrice] = useState<number | string>(599);
  const [category, setCategory] = useState('Dark');
  const [gender, setGender] = useState('Unisex');
  const [placementStr, setPlacementStr] = useState('Arm, Wrist');
  const [sizesStr, setSizesStr] = useState('Small, Medium, Large');
  const [tagsStr, setTagsStr] = useState('dark, bestseller');
  const [stock, setStock] = useState<number | string>(50);
  const [available, setAvailable] = useState<boolean>(true);
  const [featured, setFeatured] = useState(false);
  const [trending, setTrending] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);

  // Multiple Images State (Main image + at least 3 additional images)
  const [images, setImages] = useState<string[]>(['', '', '', '']);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getProducts(),
        api.getCategories()
      ]);
      if (prodRes.success) setProducts(prodRes.products);
      if (catRes.success) setCategories(catRes.categories);
    } catch (err) {
      console.error('[AdminProducts] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPrice(399);
    setComparePrice(599);
    setCategory('Dark');
    setGender('Unisex');
    setPlacementStr('Arm, Wrist');
    setSizesStr('Small, Medium, Large');
    setTagsStr('dark, editorial');
    setStock(50);
    setAvailable(true);
    setFeatured(false);
    setTrending(false);
    setNewArrival(true);
    setBestSeller(false);
    setImages([
      'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=800&q=80',
      '',
      ''
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setDescription(p.description);
    setPrice(p.price);
    setComparePrice(p.comparePrice || p.price);
    setCategory(p.category);
    setGender(p.gender || 'Unisex');
    setPlacementStr((p.placement || []).join(', '));
    setSizesStr((p.sizes || []).join(', '));
    setTagsStr((p.tags || []).join(', '));
    setStock(p.stock);
    setAvailable(p.available !== false);
    setFeatured(p.featured);
    setTrending(p.trending);
    setNewArrival(p.newArrival);
    setBestSeller(p.bestSeller);

    const existingImages = p.images && p.images.length > 0 ? [...p.images] : [''];
    while (existingImages.length < 4) {
      existingImages.push('');
    }
    setImages(existingImages);
    setIsModalOpen(true);
  };

  // Image Management Helpers
  const handleImageSlotUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingSlot(index);
    try {
      const res = await api.uploadImage(file);
      if (res.success && res.url) {
        setImages((prev) => {
          const next = [...prev];
          next[index] = res.url;
          return next;
        });
        showToast(`Image ${index === 0 ? 'Main' : index + 1} uploaded successfully`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Error uploading image', 'error');
    } finally {
      setUploadingSlot(null);
      e.target.value = '';
    }
  };

  const handleUpdateImageSlot = (index: number, value: string) => {
    setImages((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleRemoveImageSlot = (index: number) => {
    setImages((prev) => {
      if (prev.length <= 4) {
        const next = [...prev];
        next[index] = '';
        return next;
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSetAsMain = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const next = [...prev];
      const [target] = next.splice(index, 1);
      next.unshift(target);
      return next;
    });
    showToast('Selected image promoted to Main Image', 'info');
  };

  const handleMoveImage = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= images.length) return;
    setImages((prev) => {
      const next = [...prev];
      const temp = next[fromIndex];
      next[fromIndex] = next[toIndex];
      next[toIndex] = temp;
      return next;
    });
  };

  const handleAddImageSlot = () => {
    setImages((prev) => [...prev, '']);
  };

  const calculatedDiscount =
    comparePrice && Number(comparePrice) > Number(price)
      ? Math.round(((Number(comparePrice) - Number(price)) / Number(comparePrice)) * 100)
      : 0;

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category) {
      showToast('Please fill all required product details', 'error');
      return;
    }

    const cleanImages = images.map((img) => img.trim()).filter(Boolean);
    const finalImages = cleanImages.length > 0
      ? cleanImages
      : ['https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80'];

    const payload = {
      name,
      description,
      price: Number(price),
      comparePrice: Number(comparePrice),
      category,
      gender,
      placement: placementStr.split(',').map((s) => s.trim()).filter(Boolean),
      sizes: sizesStr.split(',').map((s) => s.trim()).filter(Boolean),
      images: finalImages,
      tags: tagsStr.split(',').map((s) => s.trim()).filter(Boolean),
      stock: Number(stock),
      available,
      featured,
      trending,
      newArrival,
      bestSeller
    };

    try {
      if (editingProduct) {
        await api.admin.updateProduct(editingProduct._id, payload);
        showToast('Product updated successfully', 'success');
      } else {
        await api.admin.createProduct(payload);
        showToast('New product created in catalogue', 'success');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      showToast(err.message || 'Error saving product', 'error');
    }
  };

  const handleDeleteProduct = async (id: string, prodName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${prodName}"?`)) {
      return;
    }

    try {
      await api.admin.deleteProduct(id);
      showToast(`Deleted ${prodName}`, 'info');
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err: any) {
      showToast(err.message || 'Error deleting product', 'error');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#252525] gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
            INVENTORY REPOSITORY
          </span>
          <h1 className="text-2xl font-black uppercase tracking-widest font-mono text-white">
            PRODUCT MANAGEMENT<span className="text-[#D4AF37]">.</span>
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#8B0000] text-white font-bold uppercase text-xs tracking-wider flex items-center gap-2 hover:bg-[#A30000] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW PRODUCT</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-4 p-4 bg-[#0A0A0A] border border-[#1f1f1f]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or category..."
            className="w-full bg-[#111111] border border-[#252525] pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-[#666666] focus:border-[#D4AF37] focus:outline-none transition-colors"
          />
        </div>
        <div className="text-xs font-mono text-[#666666]">
          Total: <span className="text-[#D4AF37] font-bold">{filteredProducts.length}</span> designs
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#0A0A0A] border border-[#1f1f1f] overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="text-[#666666] border-b border-[#1f1f1f] bg-[#0E0E0E]">
              <th className="p-4 font-normal">IMAGE</th>
              <th className="p-4 font-normal">PRODUCT NAME</th>
              <th className="p-4 font-normal">CATEGORY</th>
              <th className="p-4 font-normal">PRICE</th>
              <th className="p-4 font-normal">STOCK</th>
              <th className="p-4 font-normal">BADGES</th>
              <th className="p-4 font-normal text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#141414]">
            {filteredProducts.map((p) => (
              <tr key={p._id} className="hover:bg-[#111111]/60 transition-colors">
                <td className="p-4">
                  <div className="relative w-10 h-10 bg-black border border-[#252525] shrink-0 overflow-hidden">
                    <img
                      src={p.images?.[0] || 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=150&q=80'}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                    {p.images && p.images.length > 1 && (
                      <span className="absolute bottom-0 right-0 bg-black/90 text-[8px] text-[#D4AF37] px-1 font-mono">
                        +{p.images.length - 1}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 font-bold text-white max-w-[200px] truncate">
                  <div>{p.name}</div>
                </td>
                <td className="p-4 text-[#A3A3A3]">{p.category}</td>
                <td className="p-4 text-[#D4AF37] font-bold">
                  <div>₹{p.price}</div>
                  {p.comparePrice && p.comparePrice > p.price && (
                    <div className="text-[10px] text-[#666666] line-through font-normal">₹{p.comparePrice}</div>
                  )}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono border ${
                      p.stock <= 0
                        ? 'text-rose-400 bg-rose-950/20 border-rose-900'
                        : p.stock <= 25
                        ? 'text-[#B11226] bg-[#8B0000]/10 border-[#8B0000]/30'
                        : 'text-emerald-400 bg-emerald-950/20 border-emerald-900'
                    }`}
                  >
                    {p.stock} units
                  </span>
                </td>
                <td className="p-4 space-x-1">
                  {p.comparePrice && p.comparePrice > p.price && (
                    <span className="text-[9px] bg-[#8B0000] text-white px-1.5 py-0.5 uppercase font-bold">
                      {Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100)}% OFF
                    </span>
                  )}
                  {p.bestSeller && (
                    <span className="text-[9px] bg-[#D4AF37] text-black font-bold px-1.5 py-0.5 uppercase">
                      BEST
                    </span>
                  )}
                  {p.newArrival && (
                    <span className="text-[9px] bg-[#0A0A0A] text-[#D4AF37] border border-[#D4AF37]/50 px-1.5 py-0.5 uppercase font-bold">
                      NEW
                    </span>
                  )}
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(p)}
                    className="p-1.5 bg-[#151515] border border-[#252525] hover:border-white text-white transition-colors"
                    title="Edit Product"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(p._id, p.name)}
                    className="p-1.5 bg-[#151515] border border-[#252525] hover:border-rose-500 text-rose-400 transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="max-w-2xl w-full bg-[#0A0A0A] border border-[#252525] p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-[#252525] sticky top-0 bg-[#0A0A0A] z-10">
              <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-white">
                {editingProduct ? 'EDIT PRODUCT ARCHIVE' : 'REGISTER NEW PRODUCT'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#666666] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5 text-xs font-mono">
              {/* Product Name */}
              <div>
                <label className="text-[#A3A3A3] uppercase block mb-1">PRODUCT NAME *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Midnight Serpent"
                  className="w-full bg-[#111111] border border-[#252525] px-3 py-2 text-white focus:border-white focus:outline-none"
                />
              </div>

              {/* Category & Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#A3A3A3] uppercase block mb-1">CATEGORY *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#111111] border border-[#252525] px-3 py-2 text-white focus:border-white focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[#A3A3A3] uppercase block mb-1">GENDER</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-[#111111] border border-[#252525] px-3 py-2 text-white focus:border-white focus:outline-none"
                  >
                    <option value="Unisex">Unisex</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[#A3A3A3] uppercase block mb-1">DESCRIPTION *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of linework, inspiration, and formula..."
                  className="w-full bg-[#111111] border border-[#252525] px-3 py-2 text-white focus:border-white focus:outline-none"
                />
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[#A3A3A3] uppercase block mb-1">SELLING PRICE (₹) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#111111] border border-[#252525] px-3 py-2 text-white focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#A3A3A3] uppercase block mb-1">ORIGINAL PRICE (₹)</label>
                  <input
                    type="number"
                    value={comparePrice}
                    onChange={(e) => setComparePrice(e.target.value)}
                    className="w-full bg-[#111111] border border-[#252525] px-3 py-2 text-white focus:border-white focus:outline-none"
                  />
                  {calculatedDiscount > 0 ? (
                    <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
                      Discount: {calculatedDiscount}% OFF
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#666666] font-mono mt-1 block">
                      No discount active
                    </span>
                  )}
                </div>
                <div>
                  <label className="text-[#A3A3A3] uppercase block mb-1">STOCK UNITS *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-[#111111] border border-[#252525] px-3 py-2 text-white focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Studio Availability */}
              <div className="p-3 bg-[#111111] border border-[#1f1f1f] flex items-center justify-between">
                <div>
                  <span className="text-white uppercase font-bold block">STUDIO AVAILABILITY</span>
                  <span className="text-[10px] text-[#888888]">Indicate whether this tattoo design is available in studio</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-[#252525] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {/* MULTIPLE PRODUCT IMAGES SECTION */}
              <div className="space-y-3 pt-3 border-t border-[#1f1f1f]">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white uppercase font-bold text-xs tracking-wider block">
                      PRODUCT IMAGES ({images.filter(Boolean).length} Active)
                    </label>
                    <span className="text-[10px] text-[#888888] font-mono">
                      Slot 1 = Main Image. Slot 2 = Hover Alternate View. Additional slots = Detail Gallery.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddImageSlot}
                    className="px-2.5 py-1 bg-[#151515] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#D4AF37] text-[10px] font-mono uppercase flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>ADD IMAGE SLOT</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {images.map((imgUrl, idx) => {
                    const isMain = idx === 0;
                    const isHoverView = idx === 1;
                    const isUploading = uploadingSlot === idx;

                    return (
                      <div
                        key={idx}
                        className={`p-3 bg-[#111111] border ${
                          isMain ? 'border-[#D4AF37]/50' : 'border-[#222222]'
                        } space-y-2 transition-colors`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold uppercase text-white font-mono">
                              {isMain ? '1. Main Image (Primary)' : isHoverView ? '2. Additional Image (Hover View)' : `${idx + 1}. Additional Image`}
                            </span>
                            {isMain && (
                              <span className="px-1.5 py-0.5 bg-[#D4AF37] text-black text-[9px] font-bold tracking-wider uppercase font-mono">
                                MAIN CARD
                              </span>
                            )}
                            {isHoverView && (
                              <span className="px-1.5 py-0.5 bg-[#222222] text-[#D4AF37] text-[9px] tracking-wider uppercase border border-[#D4AF37]/30 font-mono">
                                HOVER ALTERNATE
                              </span>
                            )}
                          </div>

                          {/* Reordering and Actions */}
                          <div className="flex items-center gap-1">
                            {!isMain && imgUrl && (
                              <button
                                type="button"
                                onClick={() => handleSetAsMain(idx)}
                                className="px-1.5 py-0.5 text-[9px] bg-[#1a1a1a] hover:bg-[#D4AF37] hover:text-black border border-[#333333] text-[#A3A3A3] transition-colors font-mono"
                                title="Set as Main Image"
                              >
                                SET AS MAIN
                              </button>
                            )}
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(idx, 'up')}
                                className="p-1 text-[#888888] hover:text-[#D4AF37]"
                                title="Move Up"
                              >
                                ▲
                              </button>
                            )}
                            {idx < images.length - 1 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(idx, 'down')}
                                className="p-1 text-[#888888] hover:text-[#D4AF37]"
                                title="Move Down"
                              >
                                ▼
                              </button>
                            )}
                            {imgUrl ? (
                              <button
                                type="button"
                                onClick={() => handleRemoveImageSlot(idx)}
                                className="p-1 text-[#8B0000] hover:text-[#B11226]"
                                title="Clear Image"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            ) : idx >= 4 ? (
                              <button
                                type="button"
                                onClick={() => handleRemoveImageSlot(idx)}
                                className="p-1 text-[#666666] hover:text-[#8B0000]"
                                title="Remove Empty Slot"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            ) : null}
                          </div>
                        </div>

                        {/* Input, Upload Button, and Preview */}
                        <div className="flex flex-col sm:flex-row gap-2.5 items-start sm:items-center">
                          <div className="flex-1 flex gap-2 w-full">
                            <input
                              type="text"
                              value={imgUrl}
                              onChange={(e) => handleUpdateImageSlot(idx, e.target.value)}
                              placeholder={isMain ? "Main image URL or upload file..." : "Additional image URL or upload file..."}
                              className="flex-1 bg-[#0A0A0A] border border-[#252525] px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none text-xs font-mono transition-colors"
                            />
                            <label className="px-3 py-2 bg-[#1a1a1a] hover:bg-[#252525] border border-[#333333] hover:border-[#D4AF37] text-xs font-mono uppercase text-white cursor-pointer flex items-center gap-1.5 transition-colors shrink-0">
                              <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>{isUploading ? 'UPLOADING...' : 'UPLOAD'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageSlotUpload(idx, e)}
                                className="hidden"
                                disabled={isUploading}
                              />
                            </label>
                          </div>

                          {/* Preview Box */}
                          <div className="w-12 h-14 bg-black border border-[#252525] flex items-center justify-center shrink-0 overflow-hidden">
                            {imgUrl ? (
                              <img
                                src={imgUrl}
                                alt={`Slot ${idx + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=150&q=80';
                                }}
                              />
                            ) : (
                              <span className="text-[9px] text-[#444444] font-mono uppercase">
                                EMPTY
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Placements & Sizes */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#A3A3A3] uppercase block mb-1">
                    PLACEMENTS (COMMA-SEPARATED)
                  </label>
                  <input
                    type="text"
                    value={placementStr}
                    onChange={(e) => setPlacementStr(e.target.value)}
                    placeholder="Arm, Wrist, Neck"
                    className="w-full bg-[#111111] border border-[#252525] px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[#A3A3A3] uppercase block mb-1">
                    SIZES (COMMA-SEPARATED)
                  </label>
                  <input
                    type="text"
                    value={sizesStr}
                    onChange={(e) => setSizesStr(e.target.value)}
                    placeholder="Small, Medium, Large"
                    className="w-full bg-[#111111] border border-[#252525] px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Tags / Style */}
              <div>
                <label className="text-[#A3A3A3] uppercase block mb-1">
                  STYLE / TAGS (COMMA-SEPARATED)
                </label>
                <input
                  type="text"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  placeholder="dark, minimal, fine-line, irezumi"
                  className="w-full bg-[#111111] border border-[#252525] px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                />
              </div>

              {/* Badges Selection */}
              <div className="pt-2 border-t border-[#1f1f1f]">
                <label className="text-[#A3A3A3] uppercase block mb-2">PRODUCT BADGES</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <label className="flex items-center gap-1.5 cursor-pointer text-[#A3A3A3] hover:text-white">
                    <input
                      type="checkbox"
                      checked={newArrival}
                      onChange={(e) => setNewArrival(e.target.checked)}
                    />
                    <span>New Arrival</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[#A3A3A3] hover:text-white">
                    <input
                      type="checkbox"
                      checked={bestSeller}
                      onChange={(e) => setBestSeller(e.target.checked)}
                    />
                    <span>Best Seller</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[#A3A3A3] hover:text-white">
                    <input
                      type="checkbox"
                      checked={trending}
                      onChange={(e) => setTrending(e.target.checked)}
                    />
                    <span>Trending</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[#A3A3A3] hover:text-white">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                    />
                    <span>Featured / Sale</span>
                  </label>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-[#252525] flex justify-end gap-3 sticky bottom-0 bg-[#0A0A0A] py-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#252525] text-[#A3A3A3] hover:text-white uppercase"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#8B0000] text-white font-bold uppercase hover:bg-[#A30000] transition-colors shadow-lg"
                >
                  SAVE PRODUCT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
