import React, { useState, useEffect } from 'react';
import { Search, User, Mail, Phone, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { api } from '../../services/api';

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.admin.getCustomers();
        if (res.success) {
          setCustomers(res.customers);
        }
      } catch (err) {
        console.error('[AdminCustomers] Error fetching customers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#252525] gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
            CLIENTELE DIRECTORY
          </span>
          <h1 className="text-2xl font-black uppercase tracking-widest font-mono text-white">
            REGISTERED CUSTOMERS<span className="text-[#D4AF37]">.</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-[#0A0A0A] border border-[#1f1f1f]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name or email..."
            className="w-full bg-[#111111] border border-[#252525] pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-[#666666] focus:border-[#D4AF37] focus:outline-none transition-colors"
          />
        </div>
        <div className="text-xs font-mono text-[#666666]">
          Total Members: <span className="text-[#D4AF37] font-bold">{customers.length}</span>
        </div>
      </div>

      <div className="bg-[#0A0A0A] border border-[#1f1f1f] overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="text-[#666666] border-b border-[#1f1f1f] bg-[#0E0E0E]">
              <th className="p-4 font-normal">CUSTOMER</th>
              <th className="p-4 font-normal">EMAIL</th>
              <th className="p-4 font-normal">PHONE</th>
              <th className="p-4 font-normal">ORDERS</th>
              <th className="p-4 font-normal">TOTAL SPENT</th>
              <th className="p-4 font-normal">LAST ORDER</th>
              <th className="p-4 font-normal">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#141414]">
            {filtered.map((c) => (
              <tr key={c._id} className="hover:bg-[#111111]/60 transition-colors">
                <td className="p-4 font-bold text-white flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#151515] border border-[#D4AF37]/30 flex items-center justify-center text-[10px] text-[#D4AF37]">
                    {c.name.charAt(0)}
                  </div>
                  <span>{c.name}</span>
                </td>
                <td className="p-4 text-[#A3A3A3]">{c.email}</td>
                <td className="p-4 text-[#888888]">{c.phone || 'N/A'}</td>
                <td className="p-4 text-white font-bold">{c.ordersCount} orders</td>
                <td className="p-4 text-[#D4AF37] font-bold">₹{c.totalSpent}</td>
                <td className="p-4 text-[#666666]">
                  {c.lastOrder ? new Date(c.lastOrder).toLocaleDateString() : 'Never'}
                </td>
                <td className="p-4">
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
