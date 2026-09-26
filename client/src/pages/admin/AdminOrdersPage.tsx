import React, { useState, useEffect } from 'react';
import { Eye, Check, X, Search, Filter } from 'lucide-react';
import { api } from '../../services/api';
import { Order } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminOrdersPage: React.FC = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getOrders();
      if (res.success) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error('[AdminOrders] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusNote('');
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      const res = await api.admin.updateOrderStatus(
        selectedOrder.orderId,
        newStatus,
        statusNote || `Status updated to ${newStatus}`
      );
      if (res.success && res.order) {
        showToast(`Order ${selectedOrder.orderId} updated to ${newStatus}`, 'success');
        setSelectedOrder(res.order);
        setOrders((prev) =>
          prev.map((o) => (o.orderId === selectedOrder.orderId ? res.order : o))
        );
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update order status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'All' && o.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderId.toLowerCase().includes(q) ||
        o.customerDetails?.name?.toLowerCase().includes(q) ||
        o.customerDetails?.email?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const allStatuses = [
    'Pending',
    'Confirmed',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
    'Refunded'
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#252525] gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
            TRANSACTION LOGISTICS
          </span>
          <h1 className="text-2xl font-black uppercase tracking-widest font-mono text-white">
            ORDER FULFILLMENT<span className="text-[#D4AF37]">.</span>
          </h1>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-[#0A0A0A] border border-[#1f1f1f] justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, customer name or email..."
            className="w-full bg-[#111111] border border-[#252525] pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-[#666666] focus:border-[#D4AF37] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#666666]">STATUS:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#111111] border border-[#252525] text-white px-3 py-2 focus:border-[#D4AF37] focus:outline-none transition-colors"
          >
            <option value="All">All Statuses</option>
            {allStatuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0A0A0A] border border-[#1f1f1f] overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="text-[#666666] border-b border-[#1f1f1f] bg-[#0E0E0E]">
              <th className="p-4 font-normal">ORDER ID</th>
              <th className="p-4 font-normal">CUSTOMER</th>
              <th className="p-4 font-normal">DATE</th>
              <th className="p-4 font-normal">ITEMS</th>
              <th className="p-4 font-normal">AMOUNT</th>
              <th className="p-4 font-normal">PAYMENT</th>
              <th className="p-4 font-normal">STATUS</th>
              <th className="p-4 font-normal text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#141414]">
            {filteredOrders.map((o) => (
              <tr key={o._id} className="hover:bg-[#111111]/60 transition-colors">
                <td className="p-4 font-bold text-white">{o.orderId}</td>
                <td className="p-4 text-[#A3A3A3]">
                  <div>{o.customerDetails?.name}</div>
                  <div className="text-[10px] text-[#666666]">{o.customerDetails?.email}</div>
                </td>
                <td className="p-4 text-[#666666]">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-[#888888]">{o.items.length} items</td>
                <td className="p-4 text-[#D4AF37] font-bold">₹{o.totalAmount}</td>
                <td className="p-4 text-[#A3A3A3]">{o.paymentMethod}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono border ${
                      o.status === 'Delivered'
                        ? 'text-emerald-400 bg-emerald-950/20 border-emerald-900'
                        : o.status === 'Cancelled'
                        ? 'text-[#8B0000] bg-[#8B0000]/10 border-[#8B0000]/30'
                        : 'text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/30'
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => openOrderModal(o)}
                    className="px-3 py-1.5 bg-[#151515] border border-[#252525] hover:border-[#D4AF37] hover:text-[#D4AF37] text-white transition-colors"
                  >
                    MANAGE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Manage / Timeline Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="max-w-2xl w-full bg-[#0A0A0A] border border-[#D4AF37]/30 p-6 sm:p-8 space-y-6 my-8">
            <div className="flex justify-between items-center pb-4 border-b border-[#252525]">
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase block">
                  ORDER FULFILLMENT DOSSIER
                </span>
                <h2 className="text-base font-mono font-bold uppercase text-white">
                  {selectedOrder.orderId}
                </h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-[#666666] hover:text-[#D4AF37]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Update Controls */}
            <div className="p-4 bg-[#111111] border border-[#252525] space-y-3 font-mono text-xs">
              <span className="text-white font-bold block">UPDATE FULFILLMENT STATUS</span>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="bg-[#0A0A0A] border border-[#252525] text-white px-3 py-2 flex-1 focus:border-[#D4AF37] focus:outline-none transition-colors"
                >
                  {allStatuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Optional internal dispatch note..."
                  className="bg-[#0A0A0A] border border-[#252525] text-white px-3 py-2 flex-1 focus:border-[#D4AF37] focus:outline-none transition-colors"
                />
                <button
                  onClick={handleUpdateStatus}
                  disabled={updating}
                  className="px-4 py-2 bg-[#8B0000] text-white font-bold uppercase hover:bg-[#A30000] transition-colors shrink-0 shadow-sm"
                >
                  {updating ? 'SAVING...' : 'UPDATE STATUS'}
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#A3A3A3] block">ORDERED TATTOOS</span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="p-3 bg-[#111111] border border-[#1a1a1a] flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover bg-black" />
                      <div>
                        <div className="text-white font-bold">{item.name}</div>
                        <div className="text-[#666666]">Size: {item.size} • Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <span className="text-[#D4AF37] font-bold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-2 font-mono text-xs">
              <span className="text-[#A3A3A3] uppercase block">ACTIVITY TIMELINE</span>
              <div className="space-y-2 border-l border-[#252525] pl-4">
                {(selectedOrder.timeline || []).map((tl, i) => (
                  <div key={i} className="relative">
                    <div className="w-2 h-2 rounded-full bg-[#D4AF37] absolute -left-[21px] top-1.5" />
                    <div className="text-white font-bold uppercase">{tl.status}</div>
                    <div className="text-[10px] text-[#666666]">
                      {new Date(tl.timestamp).toLocaleString()} • {tl.note}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
