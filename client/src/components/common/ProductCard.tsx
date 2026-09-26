import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product._id);
  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80';
  // Alternate image on hover strictly from product's saved image collection
  const secondaryImage = product.images && product.images.length > 1 && product.images[1] !== primaryImage
    ? product.images[1]
    : null;

  // Dynamic discount calculation based on original comparePrice and selling price
  const discountPercent =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : product.discount && product.discount > 0
      ? product.discount
      : 0;

  const hasBadges = discountPercent > 0 || product.bestSeller || product.newArrival || product.trending;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id, product.name);
  };

  return (
    <div
      className="group relative flex flex-col h-full bg-[#0A0A0A] border border-[#1f1f1f] hover:border-[#D4AF37] transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container — Clean visual, no badges overlaying image */}
      <Link to={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-[#0D0D0D] shrink-0">
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-[#252525] hover:border-[#D4AF37]/60 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all"
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorited ? 'fill-[#8B0000] text-[#8B0000]' : 'text-[#B8B8B8] hover:text-[#D4AF37]'
            }`}
          />
        </button>

        {/* Primary Image View */}
        <img
          src={primaryImage}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            isHovered && secondaryImage ? 'opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Alternate Image on Hover (from same product collection) */}
        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.name} alternate view`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0'
            }`}
            loading="lazy"
          />
        )}

        {/* View & Enquire Overlay on Desktop Hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden sm:block">
          <div className="w-full py-2.5 bg-[#8B0000] text-white hover:bg-[#A30000] text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors shadow-lg">
            <span>VIEW & ENQUIRE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </Link>

      {/* Product Metadata Info Section */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* CATEGORY & RATING */}
          <div className="flex items-center justify-between text-[11px] font-mono text-[#777777] uppercase mb-1">
            <span>{product.category}</span>
            <div className="flex items-center gap-1 text-[#D4AF37]">
              <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
              <span className="text-[#F5F5F5]">{product.rating || '4.8'}</span>
            </div>
          </div>

          {/* PRODUCT NAME */}
          <Link to={`/product/${product.slug}`} className="block">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white hover:text-[#D4AF37] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* BADGES BELOW IMAGE AND PRODUCT NAME */}
          {hasBadges && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {discountPercent > 0 && (
                <span className="bg-[#8B0000] text-white text-[9px] sm:text-[10px] font-mono font-bold px-1.5 py-0.5 tracking-wider uppercase">
                  {discountPercent}% OFF
                </span>
              )}
              {product.bestSeller && (
                <span className="bg-[#D4AF37] text-black font-bold text-[9px] font-mono px-1.5 py-0.5 tracking-wider uppercase">
                  BESTSELLER
                </span>
              )}
              {product.newArrival && (
                <span className="bg-[#0A0A0A] text-[#D4AF37] border border-[#D4AF37] text-[9px] font-mono px-1.5 py-0.5 tracking-wider uppercase">
                  NEW
                </span>
              )}
              {product.trending && (
                <span className="bg-[#5C0000] text-white border border-[#8B0000]/40 text-[9px] font-mono px-1.5 py-0.5 tracking-wider uppercase">
                  TRENDING
                </span>
              )}
            </div>
          )}
        </div>

        {/* PRICING SECTION BELOW BADGES */}
        <div className="mt-3 pt-2 border-t border-[#1a1a1a] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xs sm:text-sm font-bold font-mono text-white">
              ₹{product.price}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-[11px] font-mono text-[#777777] line-through">
                ₹{product.comparePrice}
              </span>
            )}
          </div>

          {/* Mobile Enquire Arrow */}
          <Link
            to={`/product/${product.slug}`}
            className="sm:hidden p-1.5 bg-[#141414] border border-[#252525] text-[#D4AF37] hover:bg-[#8B0000] hover:text-white transition-colors"
            aria-label="View tattoo details"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
