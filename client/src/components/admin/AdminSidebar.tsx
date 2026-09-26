import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Sparkles,
  Users,
  Boxes,
  Tag,
  Star,
  Home,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Custom Tattoos', path: '/admin/custom-tattoos', icon: Sparkles },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Inventory', path: '/admin/inventory', icon: Boxes },
    { name: 'Coupons', path: '/admin/coupons', icon: Tag },
    { name: 'Reviews', path: '/admin/reviews', icon: Star },
    { name: 'Homepage CMS', path: '/admin/homepage', icon: Home },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Studio Settings', path: '/admin/settings', icon: Settings }
  ];

  const content = (
    <div className="flex flex-col h-full bg-[#0A0A0A] border-r border-[#252525] text-[#A3A3A3] w-64 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#252525] flex items-center justify-between">
        <div>
          <div className="text-white text-sm font-black tracking-widest uppercase font-mono">
            TWILIGHT THINKS<span className="text-[#D4AF37]">.</span>
          </div>
          <div className="text-[10px] text-[#D4AF37]/80 font-mono tracking-wider">
            ADMIN CONSOLE v2.0
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-[#666666] hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-xs transition-colors ${
                  isActive
                    ? 'bg-[#151515] text-[#D4AF37] border-l-2 border-[#D4AF37] font-bold'
                    : 'hover:bg-[#111111] hover:text-[#D4AF37]'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Footer controls */}
      <div className="p-4 border-t border-[#252525] space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-3 py-2 text-xs text-[#A3A3A3] hover:text-[#D4AF37] hover:bg-[#111111] rounded-xs transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Customer Store</span>
          </span>
          <span className="text-[10px] font-mono bg-[#1a1a1a] text-[#D4AF37] px-1.5 py-0.5 border border-[#D4AF37]/30">LIVE</span>
        </a>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#8B0000] hover:bg-[#8B0000]/10 hover:text-[#B11226] rounded-xs transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 shrink-0">
        {content}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative h-full w-64 max-w-full">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
