import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, cartSubtotal, cartCount } = useCart();
  const { showToast } = useToast();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const shippingCost = cartSubtotal >= 799 ? 0 : cartSubtotal > 0 ? 99 : 0;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + shippingCost);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setValidatingCoupon(true);
    try {
      const res = await api.validateCoupon(couponCode.trim(), cartSubtotal);
      if (res.success && res.coupon) {
        setAppliedCoupon(res.coupon);
        showToast(`Promo code ${res.coupon.code} applied! Saved ₹${res.coupon.discountAmount}`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Invalid coupon code', 'error');
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    navigate('/checkout', {
      state: {
        appliedCoupon: appliedCoupon ? appliedCoupon.code : null,
        discountAmount,
        shippingCost
      }
    });
  };

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-24 min-h-[70vh] bg-[#050505] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-3">
          YOUR BAG IS EMPTY
        </h1>
        <p className="text-xs sm:text-sm text-[#888888] max-w-sm mb-8 font-light">
          Your skin is a blank canvas. Discover our dark botanicals and custom silhouettes.
        </p>
        <Link
          to="/shop"
          className="px-8 py-3.5 bg-[#8B0000] text-white font-bold uppercase text-xs tracking-widest hover:bg-[#A30000] transition-colors shadow-lg shadow-[#8B0000]/20"
        >
          EXPLORE CATALOGUE
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-[#050505] min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8">
          <Link
            to="/shop"
            className="text-xs font-mono uppercase text-[#A3A3A3] hover:text-[#D4AF37] flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>CONTINUE SHOPPING</span>
          </Link>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight font-sans mb-8">
          SHOPPING BAG ({cartCount})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: Cart Items (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 bg-[#0E0E0E] border border-[#252525] hover:border-[#D4AF37]/30 transition-colors flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover bg-black border border-[#252525] shrink-0"
                  />
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#151515] border border-[#252525] text-[#D4AF37]">
                        SIZE: {item.size}
                      </span>
                      {item.isCustom && (
                        <span className="text-[10px] font-mono uppercase text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-2 py-0.5">
                          CUSTOM BESPOKE
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-[#888888] mt-1 sm:hidden">
                      Unit: ₹{item.price}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8">
                  {/* Quantity */}
                  <div className="flex items-center border border-[#252525] bg-[#111111]">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 text-[#A3A3A3] hover:text-[#D4AF37] transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-mono font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 text-[#A3A3A3] hover:text-[#D4AF37] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Price */}
                  <span className="text-sm font-bold font-mono text-[#D4AF37]">
                    ₹{item.price * item.quantity}
                  </span>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-[#666666] hover:text-[#B11226] p-2 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Order Summary Card (4 Cols) */}
          <div className="lg:col-span-4 bg-[#0A0A0A] border border-[#252525] p-6 space-y-6 h-fit">
            <h2 className="text-xs font-mono uppercase font-bold tracking-widest text-[#D4AF37] pb-3 border-b border-[#252525]">
              ORDER SUMMARY
            </h2>

            {/* Promo Code Input */}
            <div>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="PROMO CODE"
                  className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] px-3 py-2 text-xs font-mono uppercase text-white placeholder-[#666666] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={validatingCoupon}
                  className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#D4AF37] hover:text-black border border-[#252525] text-xs font-mono uppercase font-bold transition-colors shrink-0"
                >
                  {validatingCoupon ? '...' : 'APPLY'}
                </button>
              </form>
              <div className="mt-1.5 text-[10px] font-mono text-[#666666]">
                TRY CODE: <span className="text-[#D4AF37]">FIRSTDROP</span> OR <span className="text-[#D4AF37]">TWILIGHT10</span>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs font-mono pt-2 border-t border-[#1a1a1a]">
              <div className="flex justify-between text-[#888888]">
                <span>SUBTOTAL</span>
                <span className="text-white">₹{cartSubtotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#D4AF37]">
                  <span>DISCOUNT ({appliedCoupon?.code})</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-[#888888]">
                <span>SHIPPING</span>
                <span>{shippingCost === 0 ? <span className="text-emerald-400">FREE</span> : `₹${shippingCost}`}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#252525] flex justify-between items-baseline">
              <span className="text-sm font-bold uppercase tracking-wider text-white">
                TOTAL
              </span>
              <span className="text-2xl font-black font-mono text-[#D4AF37]">
                ₹{finalTotal}
              </span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-4 bg-[#8B0000] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#A30000] transition-all flex items-center justify-center gap-2 group shadow-xl shadow-[#8B0000]/20"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="pt-2 flex items-center justify-center gap-2 text-[10px] font-mono text-[#666666]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% SATISFACTION GUARANTEED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
