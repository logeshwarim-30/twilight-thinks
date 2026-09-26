import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, Truck, Package, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';
import { Order } from '../../types';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const res = await api.getOrder(id);
        if (res.success && res.order) {
          setOrder(res.order);
        }
      } catch (err) {
        console.error('[OrderDetail] Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-[60vh] bg-[#050505] flex items-center justify-center text-white font-mono text-xs">
        RETRIEVING ORDER PROTOCOL...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-32 pb-24 min-h-[60vh] bg-[#050505] flex flex-col items-center justify-center text-center text-white px-4 space-y-4">
        <h2 className="text-xl font-bold uppercase tracking-widest font-mono">ORDER NOT FOUND</h2>
        <Link to="/account/orders" className="px-6 py-2.5 bg-[#8B0000] text-white font-bold uppercase text-xs hover:bg-[#A30000] transition-colors shadow-lg shadow-[#8B0000]/20">
          BACK TO MY ORDERS
        </Link>
      </div>
    );
  }

  const steps = ['Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
  const currentStepIdx = steps.indexOf(order.status) !== -1 ? steps.indexOf(order.status) : 0;

  return (
    <div className="pt-24 pb-20 bg-[#050505] min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/account/orders"
            className="text-xs font-mono uppercase text-[#A3A3A3] hover:text-[#D4AF37] flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO MY ORDERS</span>
          </Link>
        </div>

        <div className="p-6 sm:p-8 bg-[#0A0A0A] border border-[#252525] space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#1f1f1f] gap-4">
            <div>
              <span className="text-[10px] font-mono text-[#D4AF37] uppercase block">
                ORDER RECEIPT
              </span>
              <h1 className="text-xl sm:text-2xl font-black font-mono uppercase text-white">
                {order.orderId}
              </h1>
              <div className="text-xs text-[#888888] font-mono mt-0.5">
                Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-3 py-1 uppercase inline-block">
                STATUS: {order.status}
              </span>
            </div>
          </div>

          {/* Interactive Fulfillment Timeline */}
          <div>
            <h3 className="text-xs font-mono uppercase font-bold text-[#D4AF37] tracking-widest mb-6">
              FULFILLMENT TIMELINE
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {steps.map((st, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div
                    key={st}
                    className={`p-3 border text-center font-mono ${
                      isCurrent
                        ? 'bg-[#8B0000] text-white border-[#8B0000] font-bold shadow-md shadow-[#8B0000]/20'
                        : isPassed
                        ? 'bg-[#151515] border-[#D4AF37]/40 text-[#D4AF37]'
                        : 'bg-[#111111] border-[#252525] text-[#555555]'
                    }`}
                  >
                    <div className="text-[10px] mb-1">0{idx + 1}</div>
                    <div className="text-xs uppercase">{st}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-xs font-mono uppercase font-bold text-[#A3A3A3] tracking-widest mb-4">
              TATTOOS IN PACKAGE ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-[#111111] border border-[#1a1a1a] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover bg-black border border-[#252525]"
                    />
                    <div>
                      <div className="text-xs font-bold uppercase text-white">{item.name}</div>
                      <div className="text-[10px] font-mono text-[#666666]">
                        Size: {item.size} • Qty: {item.quantity}
                        {item.isCustom && ' • Custom Design Studio Stencil'}
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

          {/* Breakdown & Addresses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-[#1f1f1f] text-xs font-mono">
            <div className="space-y-3">
              <span className="text-[10px] uppercase text-[#666666] block">
                DELIVERY RECIPIENT
              </span>
              <div className="text-white space-y-1">
                <div className="font-bold">{order.customerDetails?.name}</div>
                <div className="text-[#A3A3A3]">{order.shippingAddress?.street}</div>
                <div className="text-[#A3A3A3]">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}
                </div>
                <div className="text-[#666666] pt-1">Contact: {order.customerDetails?.phone}</div>
                <div className="text-[#666666]">Email: {order.customerDetails?.email}</div>
              </div>
            </div>

            <div className="space-y-2 bg-[#111111] p-4 border border-[#1a1a1a]">
              <span className="text-[10px] uppercase text-[#666666] block mb-2">
                INVOICE BREAKDOWN
              </span>
              <div className="flex justify-between text-[#888888]">
                <span>SUBTOTAL</span>
                <span className="text-white">₹{order.subtotal}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>DISCOUNT ({order.couponApplied || 'PROMO'})</span>
                  <span>-₹{order.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-[#888888]">
                <span>SHIPPING ({order.deliveryMethod})</span>
                <span className="text-white">{order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`}</span>
              </div>
              <div className="pt-2 border-t border-[#252525] flex justify-between items-baseline font-bold text-sm">
                <span className="text-white uppercase">TOTAL PAID</span>
                <span className="text-base text-white">₹{order.totalAmount}</span>
              </div>
              <div className="text-[10px] text-[#666666] pt-2">
                Payment Method: {order.paymentMethod} • Status: {order.paymentStatus}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
