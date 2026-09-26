import React from 'react';
import { Menu, Bell, Shield, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminHeaderProps {
  setMobileOpen: (open: boolean) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ setMobileOpen }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-[#0A0A0A] border-b border-[#252525] px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden text-[#A3A3A3] hover:text-white"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-mono uppercase tracking-wider text-[#A3A3A3]">
            SYSTEM OPERATIONAL • SECURE
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 pl-4 border-l border-[#252525]">
          <div className="w-8 h-8 rounded-full bg-[#151515] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-white leading-tight">
              {user?.name || 'Administrator'}
            </div>
            <div className="text-[10px] font-mono text-[#D4AF37]/80 uppercase">
              Super Admin
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
