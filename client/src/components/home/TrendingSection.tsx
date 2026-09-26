import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../common/ProductCard';

interface TrendingSectionProps {
  products: Product[];
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({ products }) => {
  // Show 4 trending products
  const trendingProducts = products
    .filter((p) => p.trending || p.bestSeller)
    .slice(0, 4);

  return (
    <section className="py-20 bg-[#050505] border-t border-[#1f1f1f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-2">
              CURRENT COMMUNITY OBSESSIONS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight font-sans">
              TRENDING NOW
            </h2>
          </div>
          <Link
            to="/shop"
            className="mt-4 sm:mt-0 text-xs font-mono text-[#B8B8B8] hover:text-[#D4AF37] uppercase tracking-wider flex items-center gap-1 group transition-colors"
          >
            <span>DISCOVER ALL</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#D4AF37]" />
          </Link>
        </div>

        {/* 4-col desktop, 2-col mobile */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
