import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAdmin, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('admin@twilightthinks.com');
  const [password, setPassword] = useState('TwilightAdmin@2026');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      showToast('Admin access authorized. Welcome back.', 'success');
      navigate('/admin/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Invalid administrator credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center px-4 selection:bg-white selection:text-black">
      {/* Return to store link */}
      <div className="absolute top-8 left-8">
        <Link
          to="/"
          className="text-xs font-mono uppercase text-[#666666] hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO STORE</span>
        </Link>
      </div>

      <div className="max-w-md w-full bg-[#0A0A0A] border border-[#252525] p-8 sm:p-10 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#151515] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mx-auto mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block">
            RESTRICTED SECURITY CONSOLE
          </span>
          <h1 className="text-2xl font-black uppercase tracking-widest font-mono text-white">
            TWILIGHT ADMIN<span className="text-[#D4AF37]">.</span>
          </h1>
          <p className="text-xs text-[#888888] font-light">
            Authorized personnel only. All access attempts logged.
          </p>
        </div>

        {/* Demo Credentials Pill */}
        <div className="p-3 bg-[#111111] border border-[#D4AF37]/20 text-[11px] font-mono text-[#A3A3A3] space-y-1">
          <div className="text-[#D4AF37] font-bold">PRE-LOADED DEMO ADMIN:</div>
          <div>Email: <span className="text-white">admin@twilightthinks.com</span></div>
          <div>Password: <span className="text-white">TwilightAdmin@2026</span></div>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
              ADMIN EMAIL
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@twilightthinks.com"
                className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] pl-10 pr-4 py-3 text-xs font-mono text-white placeholder-[#666666] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] pl-10 pr-4 py-3 text-xs font-mono text-white placeholder-[#666666] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#8B0000] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#A30000] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg mt-2"
          >
            <span>{loading ? 'AUTHENTICATING...' : 'ENTER CONSOLE'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
