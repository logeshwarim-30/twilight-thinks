import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Package,
  Layers,
  ChevronRight
} from 'lucide-react';
import { api } from '../../services/api';

export const AdminDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.admin.getAnalytics();
        if (res.success) {
          setAnalytics(res.analytics);
        }
      } catch (err) {
        console.error('[AdminDashboard] Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center font-mono text-xs text-[#666666]">
        SYNCHRONIZING DASHBOARD METRICS...
      </div>
    );
  }

  const kpis = [
    {
      title: 'TOTAL SALES',
      value: `₹${analytics?.totalSales?.toLocaleString('en-IN') || 0}`,
      change: '+24.8% vs last month',
      icon: TrendingUp,
      accent: 'text-[#D4AF37]'
    },
    {
      title: 'TOTAL ORDERS',
      value: analytics?.totalOrders || 0,
      change: '100% fulfillment rate',
      icon: ShoppingBag,
      accent: 'text-white'
    },
    {
      title: 'TOTAL CUSTOMERS',
      value: analytics?.totalCustomers || 0,
      change: '+18 new collectors this week',
      icon: Users,
      accent: 'text-white'
    },
    {
      title: 'LOW STOCK ITEMS',
      value: analytics?.lowStockCount || 0,
      change: 'Threshold ≤ 25 units',
      icon: AlertTriangle,
      accent: analytics?.lowStockCount > 0 ? 'text-[#B11226]' : 'text-emerald-400'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#252525] gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
            STORE ARCHITECTURE v2.0
          </span>
          <h1 className="text-2xl font-black uppercase tracking-widest font-mono text-white">
            ADMIN DASHBOARD<span className="text-[#D4AF37]">.</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-[#8B0000] text-white font-bold uppercase text-xs tracking-wider hover:bg-[#A30000] transition-colors shadow-sm"
          >
            ADD NEW PRODUCT
          </Link>
          <Link
            to="/admin/custom-tattoos"
            className="px-4 py-2 bg-[#151515] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#D4AF37] font-mono uppercase text-xs transition-colors"
          >
            STUDIO REQUESTS
          </Link>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="p-5 bg-[#0A0A0A] border border-[#1f1f1f] hover:border-[#D4AF37]/30 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono text-[#666666] uppercase tracking-widest">
                  {kpi.title}
                </span>
                <div className="p-2 bg-[#111111] border border-[#D4AF37]/30 text-[#D4AF37]">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className={`text-2xl font-black font-mono tracking-tight ${kpi.accent}`}>
                  {kpi.value}
                </div>
                <div className="text-[11px] font-mono text-[#666666] mt-1">{kpi.change}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Simulation & Top Selling Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Performance Trends (8 cols) */}
        <div className="lg:col-span-8 p-6 bg-[#0A0A0A] border border-[#1f1f1f] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#1a1a1a]">
            <div>
              <span className="text-[10px] font-mono text-[#D4AF37] uppercase block">
                MONTHLY REVENUE
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                SALES & FULFILLMENT VELOCITY
              </h2>
            </div>
            <div className="text-xs font-mono text-[#888888]">AVERAGE ORDER: <span className="text-[#D4AF37]">₹{analytics?.avgOrderValue || 0}</span></div>
          </div>

          {/* Bar Chart Simulation */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
            {(analytics?.salesChart || []).map((m: any) => {
              const heightPercent = Math.min(100, Math.round((m.sales / 150000) * 100));
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[9px] font-mono text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{(m.sales / 1000).toFixed(0)}k
                  </div>
                  <div
                    className="w-full bg-[#151515] group-hover:bg-[#8B0000] transition-all border border-[#252525] group-hover:border-[#A30000]"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[10px] font-mono text-[#666666] uppercase group-hover:text-[#D4AF37]">
                    {m.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Selling Products (4 cols) */}
        <div className="lg:col-span-4 p-6 bg-[#0A0A0A] border border-[#1f1f1f] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1a1a1a]">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#E8E8E8]">
              TOP SELLING INK
            </h2>
            <Link to="/admin/products" className="text-[10px] font-mono text-[#666666] hover:text-[#D4AF37]">
              ALL →
            </Link>
          </div>

          <div className="space-y-3">
            {(analytics?.topProducts || []).map((p: any, idx: number) => (
              <div key={p._id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-[#D4AF37]">0{idx + 1}</span>
                  <img
                    src={p.images?.[0]}
                    alt={p.name}
                    className="w-9 h-9 object-cover bg-black border border-[#252525]"
                  />
                  <div>
                    <div className="font-bold text-white uppercase truncate max-w-[130px]">{p.name}</div>
                    <div className="text-[10px] font-mono text-[#666666]">Stock: {p.stock} units</div>
                  </div>
                </div>
                <span className="font-mono text-[#D4AF37] font-bold">₹{p.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders & Low Stock Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders (8 cols) */}
        <div className="lg:col-span-8 p-6 bg-[#0A0A0A] border border-[#1f1f1f] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1a1a1a]">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-white">
              RECENT ORDERS
            </h2>
            <Link
              to="/admin/orders"
              className="text-xs font-mono text-[#888888] hover:text-[#D4AF37] flex items-center gap-1 transition-colors"
            >
              <span>VIEW ALL</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="text-[#666666] border-b border-[#1a1a1a]">
                  <th className="pb-3 font-normal">ORDER ID</th>
                  <th className="pb-3 font-normal">CUSTOMER</th>
                  <th className="pb-3 font-normal">ITEMS</th>
                  <th className="pb-3 font-normal">AMOUNT</th>
                  <th className="pb-3 font-normal">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141414]">
                {(analytics?.recentOrders || []).map((o: any) => (
                  <tr key={o._id} className="hover:bg-[#111111]/50">
                    <td className="py-3 font-bold text-white">{o.orderId}</td>
                    <td className="py-3 text-[#A3A3A3]">{o.customerDetails?.name}</td>
                    <td className="py-3 text-[#888888]">{o.items?.length || 1} designs</td>
                    <td className="py-3 text-[#D4AF37] font-bold">₹{o.totalAmount}</td>
                    <td className="py-3">
                      <span className="text-[10px] px-2 py-0.5 bg-[#151515] border border-[#D4AF37]/30 text-[#D4AF37]">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts (4 cols) */}
        <div className="lg:col-span-4 p-6 bg-[#0A0A0A] border border-[#1f1f1f] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1a1a1a]">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#B11226] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>LOW STOCK ALERTS</span>
            </h2>
            <Link to="/admin/inventory" className="text-[10px] font-mono text-[#666666] hover:text-[#D4AF37]">
              INVENTORY →
            </Link>
          </div>

          <div className="space-y-2.5">
            {(analytics?.lowStockProducts || []).map((item: any) => (
              <div
                key={item._id}
                className="p-3 bg-[#111111] border border-[#1f1f1f] flex items-center justify-between text-xs font-mono"
              >
                <div>
                  <div className="text-white font-bold truncate max-w-[150px]">{item.name}</div>
                  <div className="text-[10px] text-[#666666]">{item.category}</div>
                </div>
                <div className="text-right">
                  <div className="text-[#B11226] font-bold">{item.stock} left</div>
                  <div className="text-[9px] text-[#666666]">Alert: &lt;25</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
