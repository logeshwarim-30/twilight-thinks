import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in
  if (isAuthenticated) {
    navigate('/account');
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter your email and password', 'error');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      showToast('Signed in successfully', 'success');
      const from = (location.state as any)?.from?.pathname || '/account';
      navigate(from, { replace: true });
    } catch (err: any) {
      showToast(err.message || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 bg-[#050505] min-h-screen flex items-center justify-center text-white px-4">
      <div className="max-w-md w-full bg-[#0A0A0A] border border-[#1f1f1f] p-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
            CLIENT ACCESS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-sans">
            SIGN IN
          </h1>
          <p className="text-xs text-[#888888] font-light">
            Access your orders, saved tattoos, and bespoke design requests.
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="p-3 bg-[#111111] border border-[#252525] text-[11px] font-mono text-[#A3A3A3] space-y-1">
          <div className="text-[#D4AF37] font-bold">DEMO CUSTOMER ACCOUNT:</div>
          <div>Email: <span className="text-white">customer@twilightthinks.com</span></div>
          <div>Password: <span className="text-white">Customer@2026</span></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] pl-10 pr-4 py-3 text-xs text-white placeholder-[#666666] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label className="text-[11px] font-mono uppercase text-[#A3A3A3]">
                PASSWORD
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] pl-10 pr-4 py-3 text-xs text-white placeholder-[#666666] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#8B0000] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#A30000] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-[#8B0000]/20 mt-2"
          >
            <span>{loading ? 'SIGNING IN...' : 'CONTINUE'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#1f1f1f] text-center">
          <div className="text-xs text-[#888888]">
            Do not have an account yet?{' '}
            <Link to="/register" className="text-[#D4AF37] underline underline-offset-4 hover:text-[#E0C36E]">
              Create one now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
