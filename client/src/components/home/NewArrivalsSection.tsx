import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../common/ProductCard';

interface NewArrivalsSectionProps {
  products: Product[];
}

export const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = ({ products }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // New arrivals products
  const newArrivals = products
    .filter((p) => p.newArrival)
    .concat(products.slice(0, 8))
    .slice(0, 8);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-20 bg-[#050505] border-t border-[#1f1f1f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-2">
              FRESH FROM THE STUDIO
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight font-sans">
              NEW ARRIVALS
            </h2>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 bg-[#0D0D0D] border border-[#252525] hover:border-[#D4AF37] text-white hover:text-[#D4AF37] flex items-center justify-center transition-colors shadow-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 bg-[#0D0D0D] border border-[#252525] hover:border-[#D4AF37] text-white hover:text-[#D4AF37] flex items-center justify-center transition-colors shadow-sm"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {newArrivals.map((product) => (
            <div
              key={product._id}
              className="w-[200px] sm:w-[220px] md:w-[240px] shrink-0 snap-start flex flex-col"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
