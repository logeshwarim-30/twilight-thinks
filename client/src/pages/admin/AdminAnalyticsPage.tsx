import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Users, Layers, Award } from 'lucide-react';
import { api } from '../../services/api';

export const AdminAnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [anRes, catRes] = await Promise.all([
          api.admin.getAnalytics(),
          api.getCategories()
        ]);
        if (anRes.success) setAnalytics(anRes.analytics);
        if (catRes.success) setCategories(catRes.categories);
      } catch (err) {
        console.error('[AdminAnalytics] Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center font-mono text-xs text-[#666666]">
        CALCULATING ADVANCED ANALYTICS...
      </div>
    );
  }

  const metrics = [
    { label: 'GROSS REVENUE', value: `₹${(analytics?.totalSales || 0).toLocaleString('en-IN')}`, sub: 'Lifetime sales volume' },
    { label: 'TOTAL ORDERS', value: analytics?.totalOrders || 0, sub: 'Confirmed store transactions' },
    { label: 'AVG ORDER VALUE (AOV)', value: `₹${analytics?.avgOrderValue || 0}`, sub: 'Basket size benchmark' },
    { label: 'BESPOKE PIPELINE', value: analytics?.customTattooRequests || 0, sub: 'Custom studio requests' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#252525] gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
            FINANCIAL INTELLIGENCE
          </span>
          <h1 className="text-2xl font-black uppercase tracking-widest font-mono text-white">
            COMMERCIAL ANALYTICS<span className="text-[#D4AF37]">.</span>
          </h1>
        </div>
      </div>

      {/* 4 Metric Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {metrics.map((m, idx) => (
          <div key={m.label} className="p-5 bg-[#0A0A0A] border border-[#1f1f1f] hover:border-[#D4AF37]/30 transition-colors">
            <span className="text-[10px] text-[#666666] uppercase tracking-wider block mb-2">
              {m.label}
            </span>
            <div className={`text-2xl font-black ${idx === 0 ? 'text-[#D4AF37]' : 'text-white'}`}>{m.value}</div>
            <div className="text-[10px] text-[#888888] mt-1">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Sales Velocity Chart */}
      <div className="p-6 bg-[#0A0A0A] border border-[#1f1f1f] space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#1a1a1a]">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-white">
            REVENUE DISPATCH HISTOGRAM (LAST 6 MONTHS)
          </h2>
          <span className="text-xs font-mono text-[#D4AF37] font-bold">+38% YoY</span>
        </div>

        <div className="h-56 flex items-end justify-between gap-4 pt-6 px-4">
          {(analytics?.salesChart || []).map((bar: any) => {
            const h = Math.min(100, Math.round((bar.sales / 150000) * 100));
            return (
              <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="text-[10px] font-mono text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">
                  ₹{bar.sales.toLocaleString('en-IN')}
                </div>
                <div
                  className="w-full bg-[#151515] group-hover:bg-[#8B0000] transition-all border border-[#252525] group-hover:border-[#A30000] rounded-xs"
                  style={{ height: `${h}%` }}
                />
                <span className="text-xs font-mono text-[#666666] uppercase group-hover:text-[#D4AF37]">
                  {bar.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Categories & Top Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categories Share */}
        <div className="p-6 bg-[#0A0A0A] border border-[#1f1f1f] space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#A3A3A3] pb-3 border-b border-[#1a1a1a]">
            GENRE VELOCITY & POPULARITY
          </h3>
          <div className="space-y-3 font-mono text-xs">
            {categories.slice(0, 5).map((cat, idx) => (
              <div key={cat._id} className="space-y-1">
                <div className="flex justify-between text-white">
                  <span>{cat.name}</span>
                  <span className="text-[#D4AF37]">Rank 0{idx + 1}</span>
                </div>
                <div className="w-full h-1.5 bg-[#151515] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D4AF37] transition-all"
                    style={{ width: `${95 - idx * 15}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Product Movers */}
        <div className="p-6 bg-[#0A0A0A] border border-[#1f1f1f] space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#A3A3A3] pb-3 border-b border-[#1a1a1a]">
            TOP SELLING TATTOO DESIGNS
          </h3>
          <div className="space-y-3 font-mono text-xs">
            {(analytics?.topProducts || []).map((p: any) => (
              <div
                key={p._id}
                className="flex items-center justify-between p-2.5 bg-[#111111] border border-[#1a1a1a]"
              >
                <div className="flex items-center gap-3">
                  <img src={p.images?.[0]} alt={p.name} className="w-8 h-8 object-cover bg-black border border-[#252525]" />
                  <div>
                    <div className="text-white font-bold uppercase truncate max-w-[140px]">{p.name}</div>
                    <div className="text-[10px] text-[#666666]">{p.category}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[#D4AF37] font-bold">₹{p.price}</div>
                  <div className="text-[10px] text-[#D4AF37]">Rating {p.rating} ★</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
