import React, { useState, useEffect } from 'react';
import { Plus, Tag, Trash2, Edit2, X, Check } from 'lucide-react';
import { api } from '../../services/api';
import { Coupon } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminCouponsPage: React.FC = () => {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form Fields
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'Percentage' | 'Flat Discount' | 'Buy X Get Y'>('Percentage');
  const [discountValue, setDiscountValue] = useState<number | string>(10);
  const [minimumOrder, setMinimumOrder] = useState<number | string>(499);
  const [maximumDiscount, setMaximumDiscount] = useState<number | string>(300);
  const [usageLimit, setUsageLimit] = useState<number | string>(1000);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getCoupons();
      if (res.success) {
        setCoupons(res.coupons);
      }
    } catch (err) {
      console.error('[AdminCoupons] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setCode('');
    setDiscountType('Percentage');
    setDiscountValue(15);
    setMinimumOrder(499);
    setMaximumDiscount(300);
    setUsageLimit(1000);
    setIsModalOpen(true);
  };

  const openEditModal = (c: Coupon) => {
    setEditingCoupon(c);
    setCode(c.code);
    setDiscountType(c.discountType);
    setDiscountValue(c.discountValue);
    setMinimumOrder(c.minimumOrder);
    setMaximumDiscount(c.maximumDiscount || 500);
    setUsageLimit(c.usageLimit || 1000);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discountValue) {
      showToast('Code and discount value are required', 'error');
      return;
    }

    const payload = {
      code: code.toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minimumOrder: Number(minimumOrder),
      maximumDiscount: Number(maximumDiscount),
      usageLimit: Number(usageLimit)
    };

    try {
      if (editingCoupon) {
        await api.admin.updateCoupon(editingCoupon._id, payload);
        showToast('Coupon updated', 'success');
      } else {
        await api.admin.createCoupon(payload);
        showToast('Coupon generated', 'success');
      }
      setIsModalOpen(false);
      fetchCoupons();
    } catch (err: any) {
      showToast(err.message || 'Error saving coupon', 'error');
    }
  };

  const handleDelete = async (id: string, cCode: string) => {
    if (!window.confirm(`Delete coupon code ${cCode}?`)) return;
    try {
      await api.admin.deleteCoupon(id);
      showToast(`Coupon ${cCode} removed`, 'info');
      setCoupons((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      showToast(err.message || 'Error deleting coupon', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#252525] gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
            PROMOTION & DISCOUNT ENGINES
          </span>
          <h1 className="text-2xl font-black uppercase tracking-widest font-mono text-white">
            COUPONS & CAMPAIGNS<span className="text-[#D4AF37]">.</span>
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#8B0000] text-white font-bold uppercase text-xs tracking-wider flex items-center gap-2 hover:bg-[#A30000] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>GENERATE COUPON</span>
        </button>
      </div>

      <div className="bg-[#0A0A0A] border border-[#1f1f1f] overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="text-[#666666] border-b border-[#1f1f1f] bg-[#0E0E0E]">
              <th className="p-4 font-normal">PROMO CODE</th>
              <th className="p-4 font-normal">TYPE</th>
              <th className="p-4 font-normal">DISCOUNT</th>
              <th className="p-4 font-normal">MIN. ORDER</th>
              <th className="p-4 font-normal">MAX. CAP</th>
              <th className="p-4 font-normal">USAGE</th>
              <th className="p-4 font-normal">STATUS</th>
              <th className="p-4 font-normal text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#141414]">
            {coupons.map((c) => (
              <tr key={c._id} className="hover:bg-[#111111]/60 transition-colors">
                <td className="p-4 font-bold text-white tracking-wider flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{c.code}</span>
                </td>
                <td className="p-4 text-[#A3A3A3]">{c.discountType}</td>
                <td className="p-4 text-[#D4AF37] font-bold">
                  {c.discountType === 'Percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}
                </td>
                <td className="p-4 text-[#888888]">₹{c.minimumOrder}</td>
                <td className="p-4 text-[#888888]">₹{c.maximumDiscount || 'None'}</td>
                <td className="p-4 text-[#888888]">{c.usageCount || 0} / {c.usageLimit}</td>
                <td className="p-4">
                  <span className="text-[10px] px-2 py-0.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]">
                    Active
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(c)}
                    className="p-1.5 bg-[#151515] border border-[#252525] hover:border-[#D4AF37] hover:text-[#D4AF37] text-white transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(c._id, c.code)}
                    className="p-1.5 bg-[#151515] border border-[#252525] hover:border-[#8B0000] text-[#8B0000] hover:text-[#B11226] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full bg-[#0A0A0A] border border-[#D4AF37]/30 p-6 space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-[#252525]">
              <h2 className="font-bold uppercase text-white">
                {editingCoupon ? 'EDIT PROMO CODE' : 'CREATE PROMO CODE'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#666666] hover:text-[#D4AF37]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-[#A3A3A3] block mb-1">COUPON CODE *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FLASH20"
                  className="w-full bg-[#111111] border border-[#252525] px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none uppercase transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A3A3A3] block mb-1">TYPE</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-[#111111] border border-[#252525] px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Flat Discount">Flat Discount (₹)</option>
                    <option value="Buy X Get Y">Buy X Get Y</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#A3A3A3] block mb-1">VALUE *</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full bg-[#111111] border border-[#252525] px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A3A3A3] block mb-1">MIN ORDER (₹)</label>
                  <input
                    type="number"
                    value={minimumOrder}
                    onChange={(e) => setMinimumOrder(e.target.value)}
                    className="w-full bg-[#111111] border border-[#252525] px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[#A3A3A3] block mb-1">MAX DISCOUNT (₹)</label>
                  <input
                    type="number"
                    value={maximumDiscount}
                    onChange={(e) => setMaximumDiscount(e.target.value)}
                    className="w-full bg-[#111111] border border-[#252525] px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                  />
                </div>
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
                  className="px-5 py-2 bg-[#8B0000] text-white font-bold uppercase hover:bg-[#A30000] transition-colors shadow-sm"
                >
                  SAVE COUPON
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
