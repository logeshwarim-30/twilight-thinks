import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, User, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, phone);
      showToast('Account registered successfully! Welcome to Twilight Thinks.', 'success');
      navigate('/account');
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 bg-[#050505] min-h-screen flex items-center justify-center text-white px-4">
      <div className="max-w-md w-full bg-[#0A0A0A] border border-[#1f1f1f] p-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
            JOIN THE COLLECTIVE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-sans">
            CREATE ACCOUNT
          </h1>
          <p className="text-xs text-[#888888] font-light">
            Unlock exclusive drops, expedited checkout, and custom studio perks.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
              FULL NAME *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Mehta"
                className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] pl-10 pr-4 py-3 text-xs text-white placeholder-[#666666] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
              EMAIL ADDRESS *
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
            <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
              PHONE NUMBER
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] pl-10 pr-4 py-3 text-xs text-white placeholder-[#666666] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
              PASSWORD (MIN 6 CHARACTERS) *
            </label>
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

          <div>
            <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
              CONFIRM PASSWORD *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] pl-10 pr-4 py-3 text-xs text-white placeholder-[#666666] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#8B0000] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#A30000] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-[#8B0000]/20 mt-4"
          >
            <span>{loading ? 'CREATING ACCOUNT...' : 'REGISTER'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#1f1f1f] text-center text-xs text-[#888888]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#D4AF37] underline underline-offset-4 hover:text-[#E0C36E]">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
