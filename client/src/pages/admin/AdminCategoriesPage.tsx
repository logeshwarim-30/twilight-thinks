import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, X, Upload, Check } from 'lucide-react';
import { api } from '../../services/api';
import { Category } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminCategoriesPage: React.FC = () => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Upload State
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.getCategories();
      if (res.success) {
        setCategories(res.categories);
      }
    } catch (err) {
      console.error('[AdminCategories] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImage('');
    setStatus('active');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setStatus(cat.status);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Supported formats check: JPG, JPEG, PNG, WEBP
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const hasValidExt = /\.(jpe?g|png|webp)$/i.test(file.name);
    if (!allowedTypes.includes(file.type) && !hasValidExt) {
      showToast('Supported formats: JPG, JPEG, PNG, WEBP', 'error');
      e.target.value = '';
      return;
    }

    // Sensible file-size limit (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast('File size must be under 10MB', 'error');
      e.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const res = await api.uploadImage(file);
      if (res.success && res.url) {
        setImage(res.url);
        showToast('Category image uploaded successfully', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Error uploading category image', 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Category name is required', 'error');
      return;
    }
    if (!image) {
      showToast('Please upload a category image', 'error');
      return;
    }

    try {
      if (editingCategory) {
        await api.admin.updateCategory(editingCategory._id, {
          name: name.trim(),
          description,
          image,
          status
        });
        showToast('Category updated', 'success');
      } else {
        await api.admin.createCategory({
          name: name.trim(),
          description,
          image,
          status
        });
        showToast('Category created', 'success');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      showToast(err.message || 'Error saving category', 'error');
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!window.confirm(`Delete category "${catName}"?`)) return;
    try {
      await api.admin.deleteCategory(id);
      showToast(`Category ${catName} deleted`, 'info');
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      showToast(err.message || 'Error deleting category', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#252525] gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
            TAXONOMY CONTROL
          </span>
          <h1 className="text-2xl font-black uppercase tracking-widest font-mono text-white">
            CATEGORIES<span className="text-[#D4AF37]">.</span>
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#8B0000] text-white font-bold uppercase text-xs tracking-wider flex items-center gap-2 hover:bg-[#A30000] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>NEW CATEGORY</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="p-5 bg-[#0A0A0A] border border-[#1f1f1f] hover:border-[#D4AF37]/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[16/9] overflow-hidden bg-black mb-4 border border-[#252525]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase text-white font-mono">{cat.name}</h3>
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 uppercase border ${
                    cat.status === 'active'
                      ? 'text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/30'
                      : 'text-[#666666] bg-[#111111] border-[#252525]'
                  }`}
                >
                  {cat.status}
                </span>
              </div>
              <p className="text-xs text-[#888888] font-light mt-1 line-clamp-2">
                {cat.description || 'No description provided.'}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-[#1a1a1a] flex justify-end gap-2">
              <button
                onClick={() => openEditModal(cat)}
                className="p-1.5 bg-[#151515] border border-[#252525] hover:border-[#D4AF37] hover:text-[#D4AF37] text-white transition-colors"
                title="Edit Category"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(cat._id, cat.name)}
                className="p-1.5 bg-[#151515] border border-[#252525] hover:border-[#8B0000] text-[#8B0000] hover:text-[#B11226] transition-colors"
                title="Delete Category"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="max-w-md w-full bg-[#0A0A0A] border border-[#D4AF37]/30 p-6 space-y-4 my-8">
            <div className="flex justify-between items-center pb-3 border-b border-[#252525]">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                {editingCategory ? 'EDIT CATEGORY' : 'CREATE CATEGORY'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#666666] hover:text-[#D4AF37]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />

            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-[#A3A3A3] block mb-1">CATEGORY NAME *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cyberpunk"
                  className="w-full bg-[#111111] border border-[#252525] px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-[#A3A3A3] block mb-1">DESCRIPTION</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short genre summary..."
                  className="w-full bg-[#111111] border border-[#252525] px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                />
              </div>

              {/* Category Image Upload */}
              <div>
                {!image ? (
                  <div>
                    <label className="text-[#A3A3A3] block mb-1">CATEGORY IMAGE *</label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#252525] hover:border-[#D4AF37]/50 bg-[#111111] p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 group"
                    >
                      <Upload className="w-6 h-6 text-[#666666] group-hover:text-[#D4AF37] transition-colors" />
                      <span className="text-xs text-[#A3A3A3] group-hover:text-white uppercase tracking-wider font-bold">
                        {uploading ? 'UPLOADING...' : 'Upload Category Image'}
                      </span>
                      <button
                        type="button"
                        disabled={uploading}
                        className="mt-1 px-4 py-1.5 bg-[#8B0000] text-white font-bold uppercase text-[10px] tracking-widest hover:bg-[#A30000] transition-colors"
                      >
                        {uploading ? 'UPLOADING...' : 'UPLOAD IMAGE'}
                      </button>
                      <span className="text-[10px] text-[#555555]">JPG, JPEG, PNG, WEBP (Max 10MB)</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-[#A3A3A3] block mb-1">CURRENT IMAGE</label>
                    <div className="bg-[#111111] border border-[#252525] p-3 space-y-3">
                      <div className="aspect-[16/9] w-full overflow-hidden bg-black border border-[#252525]">
                        <img
                          src={image}
                          alt="Category preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="flex-1 py-2 bg-[#1a1a1a] hover:bg-[#252525] border border-[#333333] hover:border-[#D4AF37] text-white text-[10px] uppercase font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{uploading ? 'UPLOADING...' : 'CHANGE IMAGE'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setImage('')}
                          className="px-3 py-2 bg-[#1a1a1a] hover:bg-[#8B0000]/20 border border-[#333333] hover:border-[#8B0000] text-[#8B0000] hover:text-[#B11226] text-[10px] uppercase font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>REMOVE IMAGE</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[#A3A3A3] block mb-1">STATUS</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-[#111111] border border-[#252525] px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#252525] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#252525] text-[#A3A3A3] hover:text-white transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 bg-[#8B0000] text-white font-bold uppercase hover:bg-[#A30000] transition-colors shadow-sm"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
