import React from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { Review } from '../../types';

interface ReviewsSectionProps {
  reviews: Review[];
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  const displayReviews = reviews.slice(0, 4);

  return (
    <section className="py-24 bg-[#050505] border-t border-[#1f1f1f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-2">
              VERIFIED BUYERS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight font-sans">
              COMMUNITY VOICES
            </h2>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-2 text-xs font-mono text-[#A3A3A3]">
            <div className="flex text-[#D4AF37]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
              ))}
            </div>
            <span>4.9 / 5.0 OVERALL RATING</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayReviews.map((review, i) => (
            <div
              key={review._id || i}
              className="p-6 bg-[#0E0E0E] border border-[#252525] hover:border-[#D4AF37]/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(review.rating || 5)].map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>

                <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2 line-clamp-1">
                  "{review.title || 'Incredible Realism'}"
                </h3>

                <p className="text-xs text-[#888888] leading-relaxed font-light line-clamp-4">
                  {review.comment}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1a1a1a]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase">
                    {review.userName}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                    <CheckCircle className="w-3 h-3" />
                    <span>VERIFIED</span>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-[#666666] mt-0.5">
                  Tattoo: {review.productName}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
