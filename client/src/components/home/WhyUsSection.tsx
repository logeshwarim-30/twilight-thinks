import React from 'react';
import { Clock, Droplets, ShieldCheck, Zap } from 'lucide-react';

export const WhyUsSection: React.FC = () => {
  const pillars = [
    {
      icon: Clock,
      title: '1–2 WEEKS DURATION',
      description: 'Unlike flimsy temporary stickers that peel off in hours, our formula sinks into the top layer of your skin (epidermis) and fades naturally with cellular regeneration.'
    },
    {
      icon: Droplets,
      title: '100% WATERPROOF',
      description: 'Engineered for real life. Swims in the ocean, sweaty heavy gym sessions, and steamy showers will not wash it off. Matte finish with zero gloss or plastic film.'
    },
    {
      icon: ShieldCheck,
      title: 'PLANT-BASED & SAFE',
      description: 'Sourced from organic South American Jagua fruit (Genipa Americana). Cruelty-free, vegan, and rigorously tested for skin sensitivity.'
    },
    {
      icon: Zap,
      title: 'ZERO NEEDLES, ZERO PAIN',
      description: 'Applies in 60 seconds with simple water pressure. Appears light at first, then activates with skin chemistry to produce rich jet-black realism.'
    }
  ];

  return (
    <section className="py-24 bg-[#080808] border-t border-[#1f1f1f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-2">
            SCIENCE MEETS ART
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight font-sans">
            WHY TWILIGHT THINKS
          </h2>
          <p className="mt-4 text-sm text-[#B8B8B8] font-light leading-relaxed">
            The look and prestige of authentic permanent tattoos, without lifelong commitment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="p-6 bg-[#0D0D0D] border border-[#1f1f1f] hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]"
              >
                <div>
                  <div className="w-12 h-12 bg-[#141414] border border-[#252525] group-hover:border-[#D4AF37]/60 flex items-center justify-center text-[#D4AF37] mb-6 group-hover:scale-110 transition-all">
                    <Icon className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div className="text-[10px] font-mono text-[#D4AF37]/80 mb-1">
                    PROTOCOL 0{i + 1}
                  </div>
                  <h3 className="text-sm font-bold tracking-wider uppercase text-white group-hover:text-[#D4AF37] font-sans mb-3 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#B8B8B8] leading-relaxed font-light">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
