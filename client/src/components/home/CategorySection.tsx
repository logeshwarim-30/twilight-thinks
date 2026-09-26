import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Category } from '../../types';

interface CategorySectionProps {
  categories: Category[];
}

export const CategorySection: React.FC<CategorySectionProps> = ({ categories }) => {
  const targetCategories = ['men', 'women', 'anime', 'minimal', 'dark', 'japanese'];
  const activeCats = categories.filter((c) => c.status !== 'inactive');
  const matched = activeCats.filter((c) => targetCategories.includes(c.slug.toLowerCase()));
  const others = activeCats.filter((c) => !targetCategories.includes(c.slug.toLowerCase()));
  const displayCats = [...matched, ...others].slice(0, 6);

  return (
    <section className="py-20 bg-[#050505] border-t border-[#1f1f1f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-2">
              CURATED SILHOUETTES
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight font-sans">
              SHOP BY CATEGORY
            </h2>
          </div>
          <Link
            to="/shop"
            className="mt-4 sm:mt-0 text-xs font-mono text-[#B8B8B8] hover:text-[#D4AF37] uppercase tracking-wider flex items-center gap-1 group transition-colors"
          >
            <span>VIEW ALL GENRES</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[#D4AF37]" />
          </Link>
        </div>

        {/* 6 Category Editorial Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          {displayCats.map((cat) => (
            <Link
              key={cat._id}
              to={`/shop/${cat.slug}`}
              className="group relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-[#0D0D0D] border border-[#1f1f1f] hover:border-[#D4AF37]/80 transition-all duration-500 shadow-md hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]"
            >
              {/* Background Category Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 filter brightness-[0.75] group-hover:brightness-[0.9]"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80';
                }}
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:via-black/20 transition-all duration-300" />

              {/* Category Info Container */}
              <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between">
                <div className="flex justify-end">
                  <div className="w-8 h-8 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white group-hover:bg-[#8B0000] group-hover:border-[#8B0000] group-hover:text-white transition-all duration-300 shadow-md">
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                <div className="transform group-hover:-translate-y-1 transition-transform duration-300">
                  <h3 className="text-base sm:text-xl md:text-2xl font-black text-white group-hover:text-[#D4AF37] uppercase tracking-wider font-sans transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#B8B8B8] line-clamp-2 mt-1 font-light hidden sm:block">
                    {cat.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
