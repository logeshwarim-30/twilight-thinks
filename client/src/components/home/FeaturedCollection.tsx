import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface FeaturedCollectionProps {
  cmsData?: any;
}

export const FeaturedCollection: React.FC<FeaturedCollectionProps> = ({ cmsData }) => {
  const content = cmsData?.content || {};
  const editorialImage =
    content.image1 ||
    content.image ||
    'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=1200&q=80';
  const badge = cmsData?.badge || 'DROP 004 / EDITORIAL ARCHIVE';
  const title = content.editorialTitle || cmsData?.title || 'THE MIDNIGHT OCCULT';

  return (
    <section className="py-24 bg-[#050505] border-t border-[#1f1f1f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Visual Image (7 cols) */}
          <div className="lg:col-span-7 relative group overflow-hidden bg-[#111111] border border-[#252525]">
            <img
              src={editorialImage}
              alt="Editorial lookbook"
              className="w-full aspect-[16/10] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1200&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
                  {badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-sans">
                  {title}
                </h3>
              </div>
              <Link
                to="/shop/dark"
                className="px-4 py-2 bg-[#8B0000] text-white hover:bg-[#A30000] text-xs font-bold uppercase tracking-wider transition-colors shadow-lg"
              >
                EXPLORE DROP
              </Link>
            </div>
          </div>

          {/* Editorial Text (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:pl-6">
            <span className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-widest block">
              DESIGN PHILOSOPHY
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight font-sans leading-tight">
              BODY ART FOR THE FLUID ERA.
            </h2>

            <p className="text-sm text-[#B8B8B8] leading-relaxed font-light">
              We reject the notion that self-expression must be eternal to be authentic. Tastes evolve. Passions ignite and shift. TWILIGHT THINKS gives you the dark beauty of needlework without lifelong commitment.
            </p>

            <div className="pt-2 border-t border-[#1f1f1f] space-y-3 font-mono text-xs text-[#B8B8B8]">
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span>FORMULATION</span>
                <span className="text-[#D4AF37]">Genipa Americana Fruit Extract</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span>DEVELOPMENT TIME</span>
                <span className="text-[#D4AF37]">24–36 Hours to Deep Black</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span>REMOVAL</span>
                <span className="text-[#D4AF37]">Natural Epidermal Renewal</span>
              </div>
            </div>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase text-[#D4AF37] hover:text-[#E0C36E] tracking-widest pt-2 group transition-colors"
            >
              <span>READ THE TWILIGHT MANIFESTO</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
