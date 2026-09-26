import React, { useState, useEffect } from 'react';
import { Home, Save, Check, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { api } from '../../services/api';
import { HomepageSection } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminHomepageCMSPage: React.FC = () => {
  const { showToast } = useToast();
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  // Editable local state map
  const [formData, setFormData] = useState<Record<string, any>>({});

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await api.getHomepageSections();
      if (res.success) {
        setSections(res.sections);
        const map: Record<string, any> = {};
        res.sections.forEach((sec: HomepageSection) => {
          map[sec.key] = {
            title: sec.title,
            subtitle: sec.subtitle,
            badge: sec.badge || '',
            isActive: sec.isActive,
            content: { ...(sec.content || {}) }
          };
        });
        setFormData(map);
      }
    } catch (err) {
      console.error('[AdminCMS] Error fetching sections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleChange = (key: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };

  const handleContentChange = (key: string, contentField: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        content: {
          ...prev[key]?.content,
          [contentField]: value
        }
      }
    }));
  };

  const handleSaveSection = async (key: string) => {
    setSavingKey(key);
    try {
      const payload = formData[key];
      const res = await api.admin.updateHomepageSection(key, payload);
      if (res.success) {
        showToast(`Saved homepage section "${key}"`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating section', 'error');
    } finally {
      setSavingKey(null);
    }
  };

  const toggleSectionActive = async (key: string) => {
    const current = formData[key]?.isActive;
    const updated = !current;
    handleChange(key, 'isActive', updated);
    try {
      await api.admin.updateHomepageSection(key, { isActive: updated });
      showToast(`Section ${key} ${updated ? 'activated' : 'deactivated'}`, 'info');
    } catch (err: any) {
      showToast(err.message || 'Error toggling section', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#252525] gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
            STOREFRONT CONTENT MANAGEMENT SYSTEM
          </span>
          <h1 className="text-2xl font-black uppercase tracking-widest font-mono text-white">
            HOMEPAGE CMS<span className="text-[#D4AF37]">.</span>
          </h1>
        </div>

        <button
          onClick={fetchSections}
          className="px-4 py-2 bg-[#111111] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-xs font-mono uppercase text-[#D4AF37] flex items-center gap-2 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>RELOAD CMS</span>
        </button>
      </div>

      <div className="space-y-6">
        {sections.map((sec) => {
          const state = formData[sec.key] || {};
          const isSaving = savingKey === sec.key;
          return (
            <div
              key={sec.key}
              className="p-6 bg-[#0A0A0A] border border-[#1f1f1f] space-y-4 font-mono text-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#1a1a1a]">
                <div className="flex items-center gap-3">
                  <span className="text-white font-bold uppercase text-sm">
                    {sec.key.toUpperCase()} SECTION
                  </span>
                  <span
                    className={`text-[9px] px-2 py-0.5 border ${
                      state.isActive
                        ? 'text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/30'
                        : 'text-[#666666] bg-[#111111] border-[#252525]'
                    }`}
                  >
                    {state.isActive ? 'ACTIVE ON HOMEPAGE' : 'INACTIVE'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSectionActive(sec.key)}
                    className="p-1.5 bg-[#151515] border border-[#252525] text-white hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
                    title={state.isActive ? 'Deactivate Section' : 'Activate Section'}
                  >
                    {state.isActive ? <Eye className="w-4 h-4 text-[#D4AF37]" /> : <EyeOff className="w-4 h-4 text-[#666666]" />}
                  </button>
                  <button
                    onClick={() => handleSaveSection(sec.key)}
                    disabled={isSaving}
                    className="px-4 py-1.5 bg-[#8B0000] text-white font-bold uppercase text-xs hover:bg-[#A30000] transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'SAVING...' : 'SAVE'}</span>
                  </button>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#A3A3A3] block mb-1">SECTION TITLE</label>
                  <input
                    type="text"
                    value={state.title || ''}
                    onChange={(e) => handleChange(sec.key, 'title', e.target.value)}
                    className="w-full bg-[#111111] border border-[#252525] px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[#A3A3A3] block mb-1">BADGE / SUB-HEADING</label>
                  <input
                    type="text"
                    value={state.badge || ''}
                    onChange={(e) => handleChange(sec.key, 'badge', e.target.value)}
                    className="w-full bg-[#111111] border border-[#252525] px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#A3A3A3] block mb-1">SUBTITLE / TAGLINE DESCRIPTION</label>
                <textarea
                  rows={2}
                  value={state.subtitle || ''}
                  onChange={(e) => handleChange(sec.key, 'subtitle', e.target.value)}
                  className="w-full bg-[#111111] border border-[#252525] px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                />
              </div>

              {/* Section-Specific Content Controls */}
              {sec.key === 'hero' && (
                <div className="pt-2 border-t border-[#1a1a1a] grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#A3A3A3] block mb-1">HERO BACKGROUND IMAGE URL</label>
                    <input
                      type="url"
                      value={state.content?.heroImage || ''}
                      onChange={(e) => handleContentChange(sec.key, 'heroImage', e.target.value)}
                      className="w-full bg-[#111111] border border-[#252525] px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[#A3A3A3] block mb-1">PRIMARY CTA TEXT</label>
                    <input
                      type="text"
                      value={state.content?.primaryCta || ''}
                      onChange={(e) => handleContentChange(sec.key, 'primaryCta', e.target.value)}
                      className="w-full bg-[#111111] border border-[#252525] px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
