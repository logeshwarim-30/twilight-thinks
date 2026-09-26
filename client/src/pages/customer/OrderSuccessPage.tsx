import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Home, Truck, ShieldCheck } from 'lucide-react';
import { Order } from '../../types';

export const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const order: Order | undefined = location.state?.order;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="pt-28 pb-20 bg-[#050505] min-h-screen text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 block">
            ORDER CONFIRMED & IN PROTOCOL
          </span>

          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight font-sans text-white">
            THANK YOU FOR YOUR ORDER
          </h1>

          <p className="text-xs sm:text-sm text-[#A3A3A3] font-light max-w-md mx-auto">
            We are preparing your botanical ink order. A confirmation email and tracking link have been dispatched to{' '}
            <span className="text-white font-mono">{order.customerDetails?.email}</span>.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-[#0A0A0A] border border-[#1f1f1f] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#1f1f1f] gap-2">
            <div>
              <span className="text-[10px] font-mono text-[#666666] uppercase block">
                ORDER IDENTIFIER
              </span>
              <span className="text-lg font-mono font-bold text-white">{order.orderId}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#666666] uppercase block">
                ORDER STATUS
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900 px-2.5 py-0.5 inline-block uppercase">
                {order.status}
              </span>
            </div>
          </div>

          {/* Items Summary */}
          <div>
            <h3 className="text-xs font-mono uppercase font-bold text-[#A3A3A3] tracking-widest mb-4">
              ORDER ITEMS ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-[#111111] border border-[#1a1a1a]"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover bg-black border border-[#252525]"
                    />
                    <div>
                      <div className="text-xs font-bold uppercase text-white">{item.name}</div>
                      <div className="text-[10px] font-mono text-[#666666]">
                        Size: {item.size} • Qty: {item.quantity}
                        {item.isCustom && ' • Custom Design'}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-white">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Payment Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#1f1f1f] text-xs font-mono">
            <div>
              <span className="text-[10px] text-[#666666] uppercase block mb-1">
                DELIVERY ADDRESS
              </span>
              <div className="text-white space-y-0.5">
                <div>{order.customerDetails?.name}</div>
                <div className="text-[#A3A3A3]">{order.shippingAddress?.street}</div>
                <div className="text-[#A3A3A3]">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}
                </div>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-[#666666] uppercase block mb-1">
                PAYMENT & DISPATCH
              </span>
              <div className="text-white space-y-0.5">
                <div>Method: {order.paymentMethod}</div>
                <div className="text-[#A3A3A3]">Payment: {order.paymentStatus}</div>
                <div className="text-[#A3A3A3]">Delivery: {order.deliveryMethod} Courier</div>
              </div>
            </div>
          </div>

          {/* Totals */}
          <div className="pt-4 border-t border-[#1f1f1f] flex justify-between items-baseline text-xs font-mono">
            <span className="text-sm font-bold uppercase text-white">TOTAL PAID</span>
            <span className="text-2xl font-black text-white">₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/account/orders"
            className="px-6 py-3 bg-[#8B0000] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#A30000] text-center transition-colors shadow-lg shadow-[#8B0000]/20"
          >
            VIEW MY ORDERS
          </Link>
          <Link
            to="/shop"
            className="px-6 py-3 bg-transparent border border-[#D4AF37]/50 hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] font-mono uppercase text-xs text-center transition-colors"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    </div>
  );
};
