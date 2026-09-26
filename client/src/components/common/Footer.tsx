import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Droplets, Sparkles } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { StudioSettings } from '../../types';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [settings, setSettings] = useState<StudioSettings | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.getSettings();
        if (res.success && res.settings) {
          setSettings(res.settings);
        }
      } catch (err) {
        console.warn('[Footer] Could not load studio settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setIsSubmitted(true);
    showToast('You are on the Twilight VIP list. Code FIRSTDROP unlocked.', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-[#050505] text-[#A3A3A3] border-t border-[#252525] pt-16 pb-12">
      {/* Brand Value Pillars Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#1f1f1f]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-4 bg-[#0A0A0A] border border-[#252525] hover:border-[#D4AF37]/30 transition-colors">
            <Droplets className="w-8 h-8 text-[#D4AF37] shrink-0" />
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-widest">100% WATERPROOF INK</h4>
              <p className="text-xs text-[#666666] mt-1">Gym, ocean, & shower resistant for 10-15 days.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-[#0A0A0A] border border-[#252525] hover:border-[#D4AF37]/30 transition-colors">
            <Shield className="w-8 h-8 text-[#D4AF37] shrink-0" />
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-widest">ORGANIC PLANT FORMULA</h4>
              <p className="text-xs text-[#666666] mt-1">Dermatologist tested. Safe for all skin types.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-[#0A0A0A] border border-[#252525] hover:border-[#D4AF37]/30 transition-colors">
            <Sparkles className="w-8 h-8 text-[#D4AF37] shrink-0" />
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-widest">ZERO NEEDLES, ZERO REGRETS</h4>
              <p className="text-xs text-[#666666] mt-1">Real tattoo look and feel. Fades naturally.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="text-xl font-black text-white tracking-widest uppercase font-sans">
              TWILIGHT THINKS<span className="text-[#D4AF37]">.</span>
            </Link>
            <p className="text-xs text-[#888888] leading-relaxed max-w-sm">
              Semi-permanent tattoos designed for personal style, self-expression and experimentation.
              Crafted with organic Genipa Americana fruit juice for deep midnight realism without needles.
            </p>

            <div className="pt-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] block mb-2">
                JOIN THE TWILIGHT LIST
              </span>
              <p className="text-[11px] text-[#666666] mb-3">
                Get 10% off your first order plus secret drop alerts.
              </p>
              {isSubmitted ? (
                <div className="text-xs font-mono text-[#D4AF37] py-2 border border-[#D4AF37]/40 bg-[#0A0A0A] px-3">
                  ✓ VIP MEMBERSHIP CONFIRMED. USE CODE: <span className="font-bold text-white">FIRSTDROP</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-md">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="bg-[#0A0A0A] border border-[#252525] text-xs text-white placeholder-[#666666] px-4 py-3 focus:outline-none focus:border-[#D4AF37] flex-1"
                  />
                  <button
                    type="submit"
                    className="bg-[#8B0000] text-white hover:bg-[#A30000] px-5 text-xs font-bold tracking-widest uppercase transition-colors shrink-0 flex items-center justify-center shadow-md shadow-[#8B0000]/20"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-4 font-mono">
              SHOP
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/shop" className="hover:text-[#D4AF37] transition-colors">All Tattoos</Link>
              </li>
              <li>
                <Link to="/shop/men" className="hover:text-[#D4AF37] transition-colors">Men's Ink</Link>
              </li>
              <li>
                <Link to="/shop/women" className="hover:text-[#D4AF37] transition-colors">Women's Ink</Link>
              </li>
              <li>
                <Link to="/shop/anime" className="hover:text-[#D4AF37] transition-colors">Anime & Cyberpunk</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#D4AF37] transition-colors">Collections</Link>
              </li>
              <li>
                <Link to="/custom-tattoo" className="text-[#D4AF37] hover:text-[#E0C36E] transition-colors font-medium">
                  Custom Tattoo Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-4 font-mono">
              SUPPORT
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/contact" className="hover:text-[#D4AF37] transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#D4AF37] transition-colors">FAQs</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#D4AF37] transition-colors">About Our Ink</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#D4AF37] transition-colors">How To Apply</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#D4AF37] transition-colors">Shipping & Tracking</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#D4AF37] transition-colors">Returns & Guarantee</Link>
              </li>
            </ul>
          </div>

          {/* Connect & Social */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-4 font-mono">
              CONNECT
            </h4>
            <div className="flex space-x-3 mb-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-[#111111] border border-[#252525] flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-[#111111] border border-[#252525] flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-[#111111] border border-[#252525] flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>

            <div className="text-[11px] text-[#666666] leading-relaxed">
              STUDIO: {settings?.address || 'Bandra West, Mumbai 400050'}<br />
              CONCIERGE: {settings?.email || 'atelier@twilightthinks.com'}<br />
              HOURS: {settings?.hours || settings?.openingHours || 'Mon–Sun, 11am–9pm IST'}
            </div>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="mt-16 pt-8 border-t border-[#1f1f1f] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666666]">
          <p>© {new Date().getFullYear()} TWILIGHT THINKS INC. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-6 text-[11px]">
            <Link to="/about" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-[#D4AF37] transition-colors">Terms of Service</Link>
            <Link to="/about" className="hover:text-[#D4AF37] transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
