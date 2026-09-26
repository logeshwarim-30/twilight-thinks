import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, Droplets, Zap, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-24 pb-20 bg-[#050505] min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero */}
        <div className="text-center space-y-4 pt-8">
          <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
            ABOUT TWILIGHT THINKS
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight font-sans">
            THE NEW ERA OF BODY ART.
          </h1>
          <p className="text-sm sm:text-base text-[#A3A3A3] font-light max-w-2xl mx-auto leading-relaxed">
            We exist at the intersection of luxury fashion, street culture, dark aesthetics, and Gen-Z self-expression.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-8 border-t border-[#1f1f1f]">
          <div className="space-y-4 text-xs sm:text-sm text-[#A3A3A3] font-light leading-relaxed">
            <h2 className="text-xl font-bold uppercase tracking-wide text-white font-sans">
              IDENTITY IS FLUID.
            </h2>
            <p>
              Traditional tattooing tells you that what you love at 20 must remain on your skin at 70.
              We reject that constraint. Your style evolves. Your music tastes mutate. Your story changes.
            </p>
            <p>
              TWILIGHT THINKS was founded to pioneer a new medium: the semi-permanent fashion tattoo.
              Body art with all the depth, matte texture, and fine-line realism of authentic needlework,
              lasting 1 to 2 weeks before fading naturally.
            </p>
          </div>
          <div className="aspect-[4/3] bg-[#111111] border border-[#252525] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80"
              alt="Twilight Thinks Studio"
              className="w-full h-full object-cover filter contrast-125 brightness-90"
            />
          </div>
        </div>

        {/* Science & Formulation */}
        <div className="p-8 bg-[#0A0A0A] border border-[#252525] space-y-6">
          <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
            THE JAGUA FORMULATION
          </span>
          <h2 className="text-2xl font-bold uppercase tracking-tight text-white font-sans">
            HOW OUR PLANT-BASED INK SINK IN
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-mono">
            <div className="space-y-2">
              <span className="text-[#D4AF37] font-bold text-sm block">01 / GENIPA FRUIT</span>
              <p className="text-[#888888] font-sans font-light">
                Extracted from the organic Genipa Americana fruit tree. Naturally reactive with skin proteins.
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-[#D4AF37] font-bold text-sm block">02 / EPIDERMAL BOND</span>
              <p className="text-[#888888] font-sans font-light">
                Penetrates into the stratum corneum (top skin layer). Does not reach the dermis, meaning zero needles and zero pain.
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-[#D4AF37] font-bold text-sm block">03 / NATURAL FADE</span>
              <p className="text-[#888888] font-sans font-light">
                Develops into deep midnight black within 24 to 36 hours. Fades away as your dead skin cells naturally shed over 10 to 15 days.
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center pt-8 border-t border-[#1f1f1f]">
          <h3 className="text-xl font-bold uppercase tracking-wide text-white mb-4">
            READY TO EXPERIMENT?
          </h3>
          <div className="flex justify-center gap-4">
            <Link
              to="/shop"
              className="px-8 py-3.5 bg-[#8B0000] text-white font-bold uppercase text-xs tracking-widest hover:bg-[#A30000] transition-colors shadow-lg shadow-[#8B0000]/20"
            >
              SHOP ALL INK
            </Link>
            <Link
              to="/custom-tattoo"
              className="px-8 py-3.5 bg-transparent border border-[#D4AF37]/50 hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] font-mono uppercase text-xs transition-colors"
            >
              CUSTOM STUDIO
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
