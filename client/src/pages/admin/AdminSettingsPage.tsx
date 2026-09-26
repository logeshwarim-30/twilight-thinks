import React, { useState, useEffect } from 'react';
import {
  Save,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';
import { StudioSettings } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminSettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState<StudioSettings>({
    studioName: 'TWILIGHT THINKS',
    tagline: 'Premium Semi-Permanent Tattoo Atelier',
    phone: '+91 98200 12345',
    whatsapp: '+91 98200 12345',
    email: 'atelier@twilightthinks.com',
    address: '42 Obsidian Avenue, Colaba Arts District, Mumbai, Maharashtra 400005',
    openingHours: 'Mon - Sun: 11:00 AM - 09:00 PM',
    instagram: '@twilightthinks',
    depositPercentage: 20,
    announcementBanner: 'ATELIER RESERVATIONS OPEN • ALL TATTOOS DEVELOP INTO DEEP MIDNIGHT REALISM OVER 24H'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.getSettings();
        if (res.success && res.settings) {
          setSettings((prev) => ({ ...prev, ...res.settings }));
        }
      } catch (err) {
        console.warn('[AdminSettings] Could not load settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.admin.updateSettings(settings);
      if (res.success) {
        showToast('Studio settings and contact details updated', 'success');
      } else {
        showToast('Failed to save settings', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-xs font-mono text-[#666666]">
        LOADING STUDIO CONFIGURATION...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#252525] gap-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#D4AF37]" />
            <span>STUDIO PROFILE & CONTACT SETTINGS<span className="text-[#D4AF37]">.</span></span>
          </h1>
          <p className="text-xs text-[#888888] mt-1 font-mono">
            Configure physical studio address, operational hours, contact lines, and client booking guidelines.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-2.5 bg-[#8B0000] text-white font-bold uppercase text-xs tracking-wider flex items-center gap-2 hover:bg-[#A30000] transition-colors shadow-lg disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'SAVING...' : 'SAVE SETTINGS'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Studio Identity */}
        <div className="p-6 bg-[#0A0A0A] border border-[#1f1f1f] space-y-4">
          <h2 className="text-xs font-mono uppercase font-bold text-white tracking-widest flex items-center gap-2 pb-3 border-b border-[#1f1f1f]">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>STUDIO BRAND IDENTITY</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
                STUDIO NAME *
              </label>
              <input
                type="text"
                required
                value={settings.studioName}
                onChange={(e) => setSettings({ ...settings, studioName: e.target.value })}
                className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] p-2.5 text-xs text-white focus:outline-none font-mono transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
                BRAND TAGLINE
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] p-2.5 text-xs text-white focus:outline-none font-mono transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
              TOP TICKER ANNOUNCEMENT
            </label>
            <input
              type="text"
              value={settings.announcementBanner}
              onChange={(e) => setSettings({ ...settings, announcementBanner: e.target.value })}
              className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] p-2.5 text-xs text-white focus:outline-none font-mono transition-colors"
            />
          </div>
        </div>

        {/* Section 2: Contact Information */}
        <div className="p-6 bg-[#0A0A0A] border border-[#1f1f1f] space-y-4">
          <h2 className="text-xs font-mono uppercase font-bold text-white tracking-widest flex items-center gap-2 pb-3 border-b border-[#1f1f1f]">
            <Phone className="w-4 h-4 text-[#D4AF37]" />
            <span>CONTACT & COMMUNICATIONS</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
                STUDIO PHONE
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] p-2.5 text-xs text-white focus:outline-none font-mono transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
                WHATSAPP CONCIERGE
              </label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] p-2.5 text-xs text-white focus:outline-none font-mono transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
                STUDIO EMAIL
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] p-2.5 text-xs text-white focus:outline-none font-mono transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Physical Studio & Hours */}
        <div className="p-6 bg-[#0A0A0A] border border-[#1f1f1f] space-y-4">
          <h2 className="text-xs font-mono uppercase font-bold text-white tracking-widest flex items-center gap-2 pb-3 border-b border-[#1f1f1f]">
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
            <span>STUDIO LOCATION & OPERATING HOURS</span>
          </h2>

          <div>
            <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
              PHYSICAL ATELIER ADDRESS
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] p-2.5 text-xs text-white focus:outline-none font-mono transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
                STUDIO OPENING HOURS
              </label>
              <input
                type="text"
                value={settings.openingHours}
                onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] p-2.5 text-xs text-white focus:outline-none font-mono transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
                INSTAGRAM PROFILE
              </label>
              <input
                type="text"
                value={settings.instagram}
                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] p-2.5 text-xs text-white focus:outline-none font-mono transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#8B0000] text-white font-bold uppercase text-xs tracking-wider flex items-center gap-2 hover:bg-[#A30000] transition-colors shadow-lg disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'SAVING CHANGES...' : 'SAVE SETTINGS'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
