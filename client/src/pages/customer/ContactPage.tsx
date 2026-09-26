import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { StudioSettings } from '../../types';

export const ContactPage: React.FC = () => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Order Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [settings, setSettings] = useState<StudioSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.getSettings();
        if (res.success && res.settings) {
          setSettings(res.settings);
        }
      } catch (err) {
        console.warn('[ContactPage] Could not load studio settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill all fields', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Your message has been received by our studio concierge.', 'success');
  };

  return (
    <div className="pt-24 pb-20 bg-[#050505] min-h-screen text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 pt-8">
          <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-2">
            CONCIERGE & SUPPORT
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-sans">
            GET IN TOUCH
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#A3A3A3] font-light">
            Questions regarding our semi-permanent Jagua ink formula, bespoke custom studio tattoos, or appointment bookings?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-[#0A0A0A] border border-[#252525] space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#111111] border border-[#252525] text-[#D4AF37] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#D4AF37] block">
                    EMAIL CONCIERGE
                  </span>
                  <div className="text-sm font-bold text-white">
                    {settings?.email || 'atelier@twilightthinks.com'}
                  </div>
                  <div className="text-xs text-[#888888] mt-0.5">Response within 12 hours</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#111111] border border-[#252525] text-[#D4AF37] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#D4AF37] block">
                    STUDIO DIRECT & WHATSAPP
                  </span>
                  <div className="text-sm font-bold text-white">
                    {settings?.phone || '+91 98200 12345'}
                  </div>
                  <div className="text-xs text-[#888888] mt-0.5">
                    {settings?.openingHours || 'Mon–Sun, 11am–9pm IST'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#111111] border border-[#252525] text-[#D4AF37] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#D4AF37] block">
                    FLAGSHIP STUDIO ATELIER
                  </span>
                  <div className="text-sm font-bold text-white">
                    {settings?.address || '42 Obsidian Avenue, Colaba Arts District, Mumbai, Maharashtra 400005'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0A0A0A] border border-[#252525] p-8">
            {submitted ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#8B0000]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] mx-auto">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-wider text-white">
                  MESSAGE TRANSMITTED
                </h3>
                <p className="text-xs text-[#888888] max-w-sm mx-auto">
                  Thank you, {name}. Our dark art concierge will reply to {email} shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-[#8B0000] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#A30000] transition-colors shadow-lg shadow-[#8B0000]/20"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
                      NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] px-3.5 py-2.5 text-xs text-white placeholder-[#666666] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
                      EMAIL *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email"
                      className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] px-3.5 py-2.5 text-xs text-white placeholder-[#666666] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
                    SUBJECT
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] px-3.5 py-2.5 text-xs text-white focus:outline-none font-mono"
                  >
                    <option value="Order Inquiry">Order Inquiry / Tracking</option>
                    <option value="Custom Tattoo Support">Custom Tattoo Studio Request</option>
                    <option value="Product Application">Application / Formula Advice</option>
                    <option value="Wholesale / Press">Wholesale / Brand Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
                    MESSAGE *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry..."
                    className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] px-3.5 py-2.5 text-xs text-white placeholder-[#666666] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#8B0000] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#A30000] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#8B0000]/20"
                >
                  <Send className="w-4 h-4" />
                  <span>TRANSMIT MESSAGE</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
