import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export const CartDrawer: React.FC = () => {
  const { cart, isDrawerOpen, closeDrawer, updateQuantity, removeFromCart, cartSubtotal, cartCount } = useCart();
  const navigate = useNavigate();

  const freeShippingThreshold = 799;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const amountRemaining = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleCheckoutClick = () => {
    closeDrawer();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-screen max-w-md bg-[#0A0A0A] border-l border-[#252525] flex flex-col justify-between shadow-2xl text-white"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-[#252525] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-xs font-black tracking-widest uppercase font-mono">
                    YOUR BAG ({cartCount})
                  </span>
                </div>
                <button
                  onClick={closeDrawer}
                  className="text-[#A3A3A3] hover:text-[#D4AF37] p-1 transition-colors"
                  aria-label="Close cart drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Meter */}
              <div className="bg-[#111111] px-6 py-3 border-b border-[#252525]">
                <div className="flex justify-between items-center text-[11px] mb-1.5 font-mono">
                  <span className="text-[#A3A3A3]">
                    {amountRemaining === 0 ? (
                      <span className="text-emerald-400 font-bold">✓ YOU UNLOCKED FREE SHIPPING!</span>
                    ) : (
                      <span>ADD <span className="text-[#D4AF37] font-bold">₹{amountRemaining}</span> MORE FOR FREE EXPRESS SHIPPING</span>
                    )}
                  </span>
                  <span className="text-[#D4AF37]">{progressPercent}%</span>
                </div>
                <div className="w-full h-1 bg-[#252525] overflow-hidden rounded-full">
                  <div
                    className="h-full bg-[#8B0000] transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#111111] border border-[#252525] flex items-center justify-center text-[#666666]">
                      <ShoppingBag className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    <h3 className="text-sm font-bold tracking-widest uppercase">YOUR BAG IS EMPTY</h3>
                    <p className="text-xs text-[#666666] max-w-xs">
                      Discover our semi-permanent botanical collections and find your next statement.
                    </p>
                    <button
                      onClick={() => {
                        closeDrawer();
                        navigate('/shop');
                      }}
                      className="mt-2 px-6 py-2.5 bg-[#8B0000] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#A30000] transition-colors shadow-lg shadow-[#8B0000]/20"
                    >
                      EXPLORE TATTOOS
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 bg-[#111111] border border-[#252525] hover:border-[#D4AF37]/30 transition-colors rounded-xs group"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover bg-black shrink-0 border border-[#252525]"
                        onError={(e) => {
                          // Fallback placeholder image if network issue
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=300&q=80';
                        }}
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white line-clamp-1">
                              {item.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-[#666666] hover:text-[#B11226] transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono uppercase bg-[#1a1a1a] px-1.5 py-0.5 text-[#D4AF37] border border-[#2a2a2a]">
                              {item.size}
                            </span>
                            {item.isCustom && (
                              <span className="text-[10px] font-mono uppercase text-[#D4AF37] bg-[#D4AF37]/10 px-1.5 py-0.5 border border-[#D4AF37]/30">
                                CUSTOM
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center border border-[#252525] bg-[#0A0A0A]">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:text-[#D4AF37] text-[#A3A3A3] transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-mono">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:text-[#D4AF37] text-[#A3A3A3] transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-xs font-bold font-mono text-[#D4AF37]">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-[#252525] bg-[#0A0A0A] space-y-4">
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-[#A3A3A3]">
                      <span>SUBTOTAL</span>
                      <span className="text-white font-bold">₹{cartSubtotal}</span>
                    </div>
                    <div className="flex justify-between text-[#A3A3A3]">
                      <span>SHIPPING</span>
                      <span>{amountRemaining === 0 ? <span className="text-emerald-400">FREE</span> : 'Calculated at checkout'}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#1f1f1f] flex justify-between items-baseline">
                    <span className="text-xs font-black tracking-widest uppercase">ESTIMATED TOTAL</span>
                    <span className="text-lg font-black font-mono text-[#D4AF37]">₹{cartSubtotal}</span>
                  </div>

                  <button
                    onClick={handleCheckoutClick}
                    className="w-full py-3.5 bg-[#8B0000] text-white font-bold text-xs tracking-widest uppercase hover:bg-[#A30000] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#8B0000]/20"
                  >
                    <span>CHECKOUT</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-[#666666] pt-1">
                    <Link
                      to="/cart"
                      onClick={closeDrawer}
                      className="hover:text-[#D4AF37] underline underline-offset-4"
                    >
                      View Full Bag
                    </Link>
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Encrypted Checkout</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
