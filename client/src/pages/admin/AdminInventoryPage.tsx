import React, { useState, useEffect } from 'react';
import { Boxes, AlertTriangle, Check, RefreshCw, Plus, Minus } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminInventoryPage: React.FC = () => {
  const { showToast } = useToast();
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getInventory();
      if (res.success) {
        setInventory(res.inventory);
      }
    } catch (err) {
      console.error('[AdminInventory] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockUpdate = async (id: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      const res = await api.admin.updateInventoryStock(id, newStock);
      if (res.success) {
        showToast('Stock count synchronized', 'success');
        setInventory((prev) =>
          prev.map((item) =>
            item._id === id
              ? { ...item, currentStock: newStock, status: res.item.status }
              : item
          )
        );
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating stock', 'error');
    }
  };

  const filtered = inventory.filter((item) => {
    if (filterStatus !== 'All' && item.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#252525] gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
            STOCK REPLENISHMENT & THRESHOLDS
          </span>
          <h1 className="text-2xl font-black uppercase tracking-widest font-mono text-white">
            INVENTORY MANAGER<span className="text-[#D4AF37]">.</span>
          </h1>
        </div>

        <button
          onClick={fetchInventory}
          className="px-4 py-2 bg-[#111111] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-xs font-mono uppercase text-[#D4AF37] flex items-center gap-2 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>REFRESH AUDIT</span>
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-[#0A0A0A] border border-[#1f1f1f]">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#666666]">FILTER STATUS:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#111111] border border-[#252525] text-white px-3 py-1.5 focus:border-[#D4AF37] focus:outline-none transition-colors"
          >
            <option value="All">All Items</option>
            <option value="IN STOCK">In Stock (&gt;25)</option>
            <option value="LOW STOCK">Low Stock (1–25)</option>
            <option value="OUT OF STOCK">Out of Stock (0)</option>
          </select>
        </div>

        <div className="text-xs font-mono text-[#666666]">
          Total Tracked Items: <span className="text-[#D4AF37] font-bold">{inventory.length}</span>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#0A0A0A] border border-[#1f1f1f] overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="text-[#666666] border-b border-[#1f1f1f] bg-[#0E0E0E]">
              <th className="p-4 font-normal">PRODUCT</th>
              <th className="p-4 font-normal">CATEGORY</th>
              <th className="p-4 font-normal">CURRENT STOCK</th>
              <th className="p-4 font-normal">THRESHOLD</th>
              <th className="p-4 font-normal">STATUS</th>
              <th className="p-4 font-normal text-right">QUICK ADJUST</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#141414]">
            {filtered.map((item) => (
              <tr key={item._id} className="hover:bg-[#111111]/60 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-9 h-9 object-cover bg-black border border-[#252525]"
                  />
                  <span className="font-bold text-white max-w-[180px] truncate">{item.name}</span>
                </td>
                <td className="p-4 text-[#888888]">{item.category}</td>
                <td className="p-4 text-white font-bold text-sm">{item.currentStock} units</td>
                <td className="p-4 text-[#666666]">{item.threshold} units</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono border ${
                      item.status === 'OUT OF STOCK'
                        ? 'text-rose-400 bg-rose-950/20 border-rose-900 font-bold'
                        : item.status === 'LOW STOCK'
                        ? 'text-[#B11226] bg-[#8B0000]/10 border-[#8B0000]/30 font-bold'
                        : 'text-emerald-400 bg-emerald-950/20 border-emerald-900'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="inline-flex items-center border border-[#252525] bg-[#111111]">
                    <button
                      onClick={() => handleStockUpdate(item._id, item.currentStock, -10)}
                      className="px-2 py-1 text-[#A3A3A3] hover:text-[#D4AF37] border-r border-[#252525] transition-colors"
                      title="Decrease by 10"
                    >
                      -10
                    </button>
                    <button
                      onClick={() => handleStockUpdate(item._id, item.currentStock, -1)}
                      className="px-2 py-1 text-[#A3A3A3] hover:text-[#D4AF37] border-r border-[#252525] transition-colors"
                      title="Decrease by 1"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => handleStockUpdate(item._id, item.currentStock, 1)}
                      className="px-2 py-1 text-[#A3A3A3] hover:text-[#D4AF37] border-r border-[#252525] transition-colors"
                      title="Increase by 1"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => handleStockUpdate(item._id, item.currentStock, 25)}
                      className="px-2 py-1 text-[#A3A3A3] hover:text-[#D4AF37] transition-colors"
                      title="Increase by 25 (Restock Batch)"
                    >
                      +25
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
