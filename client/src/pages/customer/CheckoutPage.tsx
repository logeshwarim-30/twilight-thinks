import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, CreditCard, Truck, Lock } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, cartSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const statePassed = location.state || {};
  const discountAmount = statePassed.discountAmount || 0;
  const couponApplied = statePassed.appliedCoupon || '';

  // Form State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const [street, setStreet] = useState(user?.addresses?.[0]?.street || '');
  const [city, setCity] = useState(user?.addresses?.[0]?.city || '');
  const [stateName, setStateName] = useState(user?.addresses?.[0]?.state || 'Maharashtra');
  const [pincode, setPincode] = useState(user?.addresses?.[0]?.pincode || '');

  const [deliveryMethod, setDeliveryMethod] = useState<'Standard' | 'Express'>('Standard');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Cash on Delivery'>('UPI');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);

  // Delivery costs
  const shippingCost = deliveryMethod === 'Express' ? 149 : cartSubtotal >= 799 ? 0 : 99;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + shippingCost);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone) {
      showToast('Please fill in your contact information', 'error');
      return;
    }

    if (!street || !city || !pincode) {
      showToast('Please provide your complete delivery address', 'error');
      return;
    }

    if (paymentMethod === 'UPI' && !upiId) {
      showToast('Please enter your UPI VPA (e.g. name@okhdfcbank)', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const orderPayload = {
        customerDetails: { name, email, phone },
        items: cart.map((i) => ({
          product: i.productId.startsWith('prd_') || i.productId.length === 24 ? i.productId : null,
          name: i.name,
          image: i.image,
          size: i.size,
          quantity: i.quantity,
          price: i.price,
          isCustom: i.isCustom || false,
          customDetails: i.customDetails
        })),
        shippingAddress: {
          street,
          city,
          state: stateName,
          pincode,
          country: 'India'
        },
        deliveryMethod,
        shippingCost,
        discountAmount,
        couponApplied,
        subtotal: cartSubtotal,
        totalAmount: finalTotal,
        paymentMethod
      };

      const res = await api.createOrder(orderPayload);
      if (res.success && res.order) {
        clearCart();
        navigate('/order-success', { state: { order: res.order } });
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-24 min-h-[60vh] bg-[#050505] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-xl font-bold uppercase tracking-tight text-white mb-2">NO ITEMS IN BAG</h2>
        <p className="text-xs text-[#888888] mb-6">Add tattoos to your bag before checking out.</p>
        <Link to="/shop" className="px-6 py-2.5 bg-white text-black font-bold uppercase text-xs">
          EXPLORE TATTOOS
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-[#050505] min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between pb-4 border-b border-[#1f1f1f]">
          <div>
            <span className="text-[10px] font-mono text-[#666666] uppercase tracking-widest block">
              FINAL STEP
            </span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-sans">
              SECURE CHECKOUT
            </h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
            <Lock className="w-4 h-4" />
            <span>256-BIT ENCRYPTED</span>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: Checkout Form Steps (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* STEP 1: Contact Information */}
            <div className="p-6 bg-[#0A0A0A] border border-[#252525] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1a1a1a]">
                <h3 className="text-xs font-mono uppercase font-bold tracking-widest text-[#D4AF37]">
                  1. CONTACT INFORMATION
                </h3>
                <span className="text-[10px] font-mono text-[#666666]">REQUIRED</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Mehta"
                    className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] px-3.5 py-2.5 text-xs text-white placeholder-[#666666] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] px-3.5 py-2.5 text-xs text-white placeholder-[#666666] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
                    PHONE NUMBER *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] px-3.5 py-2.5 text-xs text-white placeholder-[#666666] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* STEP 2: Shipping Address */}
            <div className="p-6 bg-[#0A0A0A] border border-[#252525] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1a1a1a]">
                <h3 className="text-xs font-mono uppercase font-bold tracking-widest text-[#D4AF37]">
                  2. SHIPPING ADDRESS
                </h3>
                <span className="text-[10px] font-mono text-[#666666]">DOMESTIC (INDIA)</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
                    STREET ADDRESS / FLAT / BUILDING *
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. Flat 402, Highline Towers, Pali Hill"
                    className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] px-3.5 py-2.5 text-xs text-white placeholder-[#666666] focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
                      CITY *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] px-3.5 py-2.5 text-xs text-white placeholder-[#666666] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
                      STATE *
                    </label>
                    <input
                      type="text"
                      required
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="e.g. Maharashtra"
                      className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] px-3.5 py-2.5 text-xs text-white placeholder-[#666666] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
                      PINCODE *
                    </label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="400050"
                      className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] px-3.5 py-2.5 text-xs text-white placeholder-[#666666] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 3: Delivery Options */}
            <div className="p-6 bg-[#0A0A0A] border border-[#252525] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1a1a1a]">
                <h3 className="text-xs font-mono uppercase font-bold tracking-widest text-[#D4AF37]">
                  3. DELIVERY METHOD
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('Standard')}
                  className={`p-4 border text-left flex justify-between items-center transition-all ${
                    deliveryMethod === 'Standard'
                      ? 'bg-[#151515] border-[#D4AF37]'
                      : 'bg-[#111111] border-[#252525] text-[#888888]'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold uppercase text-white">STANDARD COURIER</div>
                    <div className="text-[11px] text-[#666666] mt-0.5 font-mono">3–5 Business Days</div>
                  </div>
                  <span className="text-xs font-mono text-[#D4AF37]">
                    {cartSubtotal >= 799 ? 'FREE' : '₹99'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('Express')}
                  className={`p-4 border text-left flex justify-between items-center transition-all ${
                    deliveryMethod === 'Express'
                      ? 'bg-[#151515] border-[#D4AF37]'
                      : 'bg-[#111111] border-[#252525] text-[#888888]'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold uppercase text-white">EXPRESS AIR DISPATCH</div>
                    <div className="text-[11px] text-[#666666] mt-0.5 font-mono">1–2 Business Days</div>
                  </div>
                  <span className="text-xs font-mono text-[#D4AF37]">₹149</span>
                </button>
              </div>
            </div>

            {/* STEP 4: Payment Simulation */}
            <div className="p-6 bg-[#0A0A0A] border border-[#252525] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1a1a1a]">
                <h3 className="text-xs font-mono uppercase font-bold tracking-widest text-[#D4AF37]">
                  4. PAYMENT METHOD
                </h3>
              </div>

              <div className="space-y-3">
                {/* UPI Option */}
                <div
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 border cursor-pointer transition-all ${
                    paymentMethod === 'UPI'
                      ? 'bg-[#151515] border-[#D4AF37]'
                      : 'bg-[#111111] border-[#252525]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-white">
                      UPI (GPay / PhonePe / Paytm / Cred)
                    </span>
                    <span className="text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-2 py-0.5">
                      FASTEST
                    </span>
                  </div>
                  {paymentMethod === 'UPI' && (
                    <div className="pt-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="Enter your UPI ID (e.g. mobile@upi)"
                        className="w-full bg-[#0A0A0A] border border-[#252525] focus:border-[#D4AF37] px-3 py-2 text-xs font-mono text-white placeholder-[#666666] focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Card Option */}
                <div
                  onClick={() => setPaymentMethod('Card')}
                  className={`p-4 border cursor-pointer transition-all ${
                    paymentMethod === 'Card'
                      ? 'bg-[#151515] border-[#D4AF37]'
                      : 'bg-[#111111] border-[#252525]'
                  }`}
                >
                  <span className="text-xs font-bold uppercase text-white block mb-2">
                    CREDIT / DEBIT CARD
                  </span>
                  {paymentMethod === 'Card' && (
                    <div className="space-y-2 pt-1">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Card Number (Demo: 4242 •••• •••• 4242)"
                        className="w-full bg-[#0A0A0A] border border-[#252525] focus:border-[#D4AF37] px-3 py-2 text-xs font-mono text-white placeholder-[#666666] focus:outline-none"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="bg-[#0A0A0A] border border-[#252525] focus:border-[#D4AF37] px-3 py-2 text-xs font-mono text-white placeholder-[#666666] focus:outline-none"
                        />
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="CVV"
                          className="bg-[#0A0A0A] border border-[#252525] focus:border-[#D4AF37] px-3 py-2 text-xs font-mono text-white placeholder-[#666666] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* COD Option */}
                <div
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`p-4 border cursor-pointer transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'bg-[#151515] border-[#D4AF37]'
                      : 'bg-[#111111] border-[#252525]'
                  }`}
                >
                  <span className="text-xs font-bold uppercase text-white">
                    CASH ON DELIVERY (COD)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0A0A0A] border border-[#252525] p-6 space-y-6 h-fit sticky top-28">
            <h2 className="text-xs font-mono uppercase font-bold tracking-widest text-[#D4AF37] pb-3 border-b border-[#252525]">
              BAG SUMMARY ({cart.length} ITEMS)
            </h2>

            {/* Item Mini Thumbnails */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover bg-black border border-[#252525]"
                    />
                    <div>
                      <div className="font-bold uppercase text-white line-clamp-1">{item.name}</div>
                      <div className="text-[10px] font-mono text-[#666666]">
                        {item.size} • Qty: {item.quantity}
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-[#D4AF37]">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-[#1f1f1f] space-y-2 text-xs font-mono">
              <div className="flex justify-between text-[#888888]">
                <span>SUBTOTAL</span>
                <span>₹{cartSubtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#D4AF37]">
                  <span>DISCOUNT ({couponApplied})</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-[#888888]">
                <span>SHIPPING ({deliveryMethod})</span>
                <span>{shippingCost === 0 ? <span className="text-emerald-400">FREE</span> : `₹${shippingCost}`}</span>
              </div>
              <div className="pt-3 border-t border-[#252525] flex justify-between items-baseline">
                <span className="text-sm font-bold uppercase text-white">TOTAL DUE</span>
                <span className="text-2xl font-black font-mono text-[#D4AF37]">₹{finalTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-[#8B0000] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#A30000] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-[#8B0000]/20"
            >
              <span>{isProcessing ? 'PLACING ORDER...' : `PAY ₹${finalTotal}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
