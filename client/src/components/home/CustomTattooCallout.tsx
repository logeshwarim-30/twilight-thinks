import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Upload, Type, Eye, Layers } from 'lucide-react';

export const CustomTattooCallout: React.FC = () => {
  return (
    <section className="py-24 bg-[#080808] border-t border-[#1f1f1f] relative overflow-hidden">
      {/* Background Graphic elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Text and CTA */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0D0D0D] border border-[#D4AF37]/30 text-[11px] font-mono tracking-widest text-[#D4AF37] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>BESPOKE TATTOO STUDIO</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight font-sans leading-tight">
              CREATE YOUR OWN TATTOO.
            </h2>

            <p className="text-sm sm:text-base text-[#B8B8B8] leading-relaxed font-light">
              Turn your personal idea, meaningful date, cursive signature, pet portrait, or custom artwork into a dermatologist-grade semi-permanent tattoo that develops into deep midnight ink.
            </p>

            {/* Feature Steps Pills */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-[#0D0D0D] border border-[#1f1f1f] hover:border-[#D4AF37]/40 flex items-center gap-3 transition-colors">
                <Upload className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-mono text-[#B8B8B8]">Upload Photo / Art</span>
              </div>
              <div className="p-3 bg-[#0D0D0D] border border-[#1f1f1f] hover:border-[#D4AF37]/40 flex items-center gap-3 transition-colors">
                <Type className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-mono text-[#B8B8B8]">Custom Typography</span>
              </div>
              <div className="p-3 bg-[#0D0D0D] border border-[#1f1f1f] hover:border-[#D4AF37]/40 flex items-center gap-3 transition-colors">
                <Layers className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-mono text-[#B8B8B8]">Body Placement</span>
              </div>
              <div className="p-3 bg-[#0D0D0D] border border-[#1f1f1f] hover:border-[#D4AF37]/40 flex items-center gap-3 transition-colors">
                <Eye className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-mono text-[#B8B8B8]">Live Realism Preview</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                to="/custom-tattoo"
                className="px-8 py-4 bg-[#8B0000] text-white hover:bg-[#A30000] text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 group shadow-[0_4px_25px_rgba(139,0,0,0.4)]"
              >
                <span>OPEN TATTOO BUILDER</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="text-xs font-mono text-[#777777]">
                Starts at <span className="text-[#D4AF37] font-bold">₹399</span> • 24hr Studio Rendering
              </div>
            </div>
          </div>

          {/* Right Visual Interactive Showcase Card */}
          <div className="relative">
            <div className="aspect-[4/3] sm:aspect-square bg-[#0D0D0D] border border-[#252525] p-6 relative overflow-hidden flex flex-col justify-between">
              <div className="flex justify-between items-center z-10">
                <span className="text-[10px] font-mono text-[#777777] tracking-widest uppercase">
                  SIMULATION PROTOCOL 01
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900 px-2 py-0.5">
                  LIVE ENGINE
                </span>
              </div>

              {/* Tattoo Placement Silhouette Art Mockup */}
              <div className="relative flex items-center justify-center my-6">
                <img
                  src="https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=800&q=80"
                  alt="Custom tattoo placement simulation"
                  className="w-full max-h-64 object-cover filter contrast-125 brightness-90 border border-[#252525]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/80 backdrop-blur-md border border-[#333333] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      "SOLITUDE IN MOTION"
                    </div>
                    <div className="text-[10px] text-[#B8B8B8] font-mono">
                      Gothic Serif • Forearm Placement • <span className="text-[#D4AF37]">₹499</span>
                    </div>
                  </div>
                  <Link
                    to="/custom-tattoo"
                    className="text-[11px] font-mono text-[#D4AF37] underline underline-offset-2 hover:text-[#E0C36E]"
                  >
                    Customize
                  </Link>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] font-mono text-[#666666] z-10 pt-2 border-t border-[#1f1f1f]">
                <span>PLANT-BASED FORMULA</span>
                <span>ZERO NEEDLES</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
