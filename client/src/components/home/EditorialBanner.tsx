import React from 'react';
import { Link } from 'react-router-dom';

export const EditorialBanner: React.FC = () => {
  return (
    <section className="relative py-28 bg-[#050505] overflow-hidden border-t border-[#1f1f1f]">
      {/* Editorial Monochrome Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1600&q=80"
          alt="Editorial banner"
          className="w-full h-full object-cover filter contrast-125 brightness-[0.25]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl">
          <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] block mb-4">
            AESTHETIC MANIFESTO
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight font-sans leading-tight">
            NO PERMANENCE. ONLY STATEMENT.
          </h2>
          <p className="mt-6 text-sm sm:text-base text-[#A3A3A3] leading-relaxed font-light">
            Wear what you feel today. Swap it next week. The new era of body art belongs to those who experiment fearlessly.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              to="/shop"
              className="px-8 py-3.5 bg-[#8B0000] text-white hover:bg-[#A30000] text-xs font-bold tracking-widest uppercase transition-colors shadow-lg shadow-[#8B0000]/20"
            >
              SHOP CATALOGUE
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
