import React, { useState, useEffect } from 'react';
import { Star, Check, EyeOff, Trash2, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { Review } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminReviewsPage: React.FC = () => {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.getReviews();
      if (res.success) {
        setReviews(res.reviews);
      }
    } catch (err) {
      console.error('[AdminReviews] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.admin.updateReviewStatus(id, status);
      showToast(`Review set to ${status}`, 'success');
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: status as any } : r))
      );
    } catch (err: any) {
      showToast(err.message || 'Error updating review', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this customer review?')) return;
    try {
      await api.admin.deleteReview(id);
      showToast('Review removed', 'info');
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err: any) {
      showToast(err.message || 'Error deleting review', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#252525] gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
            SOCIAL PROOF & COMMUNITY
          </span>
          <h1 className="text-2xl font-black uppercase tracking-widest font-mono text-white">
            REVIEW MODERATION<span className="text-[#D4AF37]">.</span>
          </h1>
        </div>
      </div>

      <div className="space-y-3">
        {reviews.map((rev) => (
          <div
            key={rev._id}
            className="p-5 bg-[#0A0A0A] border border-[#1f1f1f] hover:border-[#D4AF37]/30 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="flex text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'fill-transparent text-[#444444]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-white uppercase font-mono">
                  {rev.userName}
                </span>
                <span className="text-[10px] font-mono text-[#666666]">
                  • On <span className="text-[#D4AF37]">"{rev.productName}"</span>
                </span>
              </div>

              {rev.title && (
                <div className="text-xs font-bold text-[#E8E8E8] font-mono">"{rev.title}"</div>
              )}
              <p className="text-xs text-[#888888] font-light leading-relaxed">{rev.comment}</p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center font-mono text-xs shrink-0">
              <span
                className={`text-[9px] px-2 py-0.5 border ${
                  rev.status === 'Approved'
                    ? 'text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/30'
                    : 'text-[#666666] bg-[#111111] border-[#252525]'
                }`}
              >
                {rev.status}
              </span>

              {rev.status !== 'Approved' ? (
                <button
                  onClick={() => handleUpdateStatus(rev._id, 'Approved')}
                  className="p-1.5 bg-[#151515] border border-[#252525] hover:border-[#D4AF37] text-[#D4AF37]"
                  title="Approve Review"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => handleUpdateStatus(rev._id, 'Hidden')}
                  className="p-1.5 bg-[#151515] border border-[#252525] hover:border-amber-500 text-amber-400"
                  title="Hide Review"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={() => handleDelete(rev._id)}
                className="p-1.5 bg-[#151515] border border-[#252525] hover:border-[#8B0000] text-[#8B0000] hover:text-[#B11226] transition-colors"
                title="Delete Review"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
