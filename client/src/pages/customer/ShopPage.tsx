import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronDown, Check, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { api } from '../../services/api';
import { Product } from '../../types';
import { ProductCard } from '../../components/common/ProductCard';

export const ShopPage: React.FC = () => {
  const { category: categoryParam } = useParams<{ category?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryParam ? categoryParam.toLowerCase() : 'all'
  );
  const [selectedPlacement, setSelectedPlacement] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');

  // Update selectedCategory if URL param changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam.toLowerCase());
    } else {
      setSelectedCategory('all');
    }
  }, [categoryParam]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.getProducts();
        if (res.success) {
          setProducts(res.products);
        }
      } catch (err) {
        console.error('[Shop] Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category
        if (selectedCategory !== 'all') {
          if (p.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
        }

        // Placement
        if (selectedPlacement !== 'all') {
          if (!p.placement || !p.placement.some((pl) => pl.toLowerCase() === selectedPlacement.toLowerCase())) {
            return false;
          }
        }

        // Size
        if (selectedSize !== 'all') {
          if (!p.sizes || !p.sizes.some((sz) => sz.toLowerCase() === selectedSize.toLowerCase())) {
            return false;
          }
        }

        // Price
        if (selectedPriceRange === 'under-299' && p.price >= 299) return false;
        if (selectedPriceRange === '299-499' && (p.price < 299 || p.price > 499)) return false;
        if (selectedPriceRange === '499-plus' && p.price < 499) return false;

        // Stock
        if (inStockOnly && p.stock <= 0) return false;

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'newest':
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
          case 'best-selling':
            return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0) || b.reviewCount - a.reviewCount;
          case 'featured':
          default:
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        }
      });
  }, [
    products,
    selectedCategory,
    selectedPlacement,
    selectedSize,
    selectedPriceRange,
    inStockOnly,
    sortBy
  ]);

  const categories = [
    { label: 'All Categories', value: 'all' },
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Anime', value: 'anime' },
    { label: 'Minimal', value: 'minimal' },
    { label: 'Dark', value: 'dark' },
    { label: 'Japanese', value: 'japanese' },
    { label: 'Spiritual', value: 'spiritual' },
    { label: 'Nature', value: 'nature' },
    { label: 'Couple', value: 'couple' },
    { label: 'Cyberpunk', value: 'cyberpunk' }
  ];

  const placements = [
    { label: 'All Placements', value: 'all' },
    { label: 'Arm', value: 'arm' },
    { label: 'Wrist', value: 'wrist' },
    { label: 'Finger', value: 'finger' },
    { label: 'Neck', value: 'neck' },
    { label: 'Chest', value: 'chest' },
    { label: 'Back', value: 'back' },
    { label: 'Ankle', value: 'ankle' },
    { label: 'Shoulder', value: 'shoulder' }
  ];

  const sizes = [
    { label: 'All Sizes', value: 'all' },
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' }
  ];

  const priceRanges = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under ₹299', value: 'under-299' },
    { label: '₹299–₹499', value: '299-499' },
    { label: '₹499+', value: '499-plus' }
  ];

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedPlacement('all');
    setSelectedSize('all');
    setSelectedPriceRange('all');
    setInStockOnly(false);
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedPlacement !== 'all' ||
    selectedSize !== 'all' ||
    selectedPriceRange !== 'all' ||
    inStockOnly;

  return (
    <div className="pt-24 pb-20 bg-[#050505] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Catalogue Breadcrumb & Title */}
        <div className="mb-8 pb-6 border-b border-[#1f1f1f] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block mb-1">
              CATALOGUE / {selectedCategory.toUpperCase()}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-sans">
              {selectedCategory === 'all' ? 'ALL TATTOOS' : `${selectedCategory} COLLECTION`}
            </h1>
            <p className="text-xs text-[#888888] mt-1 font-light">
              Showing {filteredProducts.length} semi-permanent body designs
            </p>
          </div>

          {/* Controls: Mobile Filter Button & Sort Dropdown */}
          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2.5 bg-[#111111] border border-[#252525] text-white text-xs font-mono uppercase flex items-center gap-2 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
              <span>FILTERS {hasActiveFilters && '•'}</span>
            </button>

            {/* Sort Select */}
            <div className="relative flex items-center bg-[#111111] border border-[#252525] px-3 py-2 text-xs font-mono focus-within:border-[#D4AF37]">
              <span className="text-[#666666] mr-2 uppercase hidden sm:inline">SORT:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-[#D4AF37] font-mono text-xs focus:outline-none cursor-pointer pr-4"
              >
                <option value="featured" className="bg-[#111111] text-white">Featured</option>
                <option value="newest" className="bg-[#111111] text-white">Newest</option>
                <option value="best-selling" className="bg-[#111111] text-white">Best Selling</option>
                <option value="price-asc" className="bg-[#111111] text-white">Price: Low to High</option>
                <option value="price-desc" className="bg-[#111111] text-white">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout Grid: Left Sidebar + Right Products */}
        <div className="flex gap-8">
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-8 select-none text-xs">
            {/* Category Filter */}
            <div>
              <h3 className="font-mono uppercase font-bold text-[#D4AF37] tracking-widest text-[11px] mb-3 pb-1 border-b border-[#252525]">
                CATEGORY
              </h3>
              <ul className="space-y-1.5 font-mono">
                {categories.map((c) => (
                  <li key={c.value}>
                    <button
                      onClick={() => setSelectedCategory(c.value)}
                      className={`w-full text-left py-1 px-2 flex justify-between items-center transition-colors ${
                        selectedCategory === c.value
                          ? 'bg-[#151515] text-[#D4AF37] font-bold border-l-2 border-[#D4AF37]'
                          : 'text-[#888888] hover:text-[#D4AF37]'
                      }`}
                    >
                      <span>{c.label}</span>
                      {selectedCategory === c.value && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Placement Filter */}
            <div>
              <h3 className="font-mono uppercase font-bold text-[#D4AF37] tracking-widest text-[11px] mb-3 pb-1 border-b border-[#252525]">
                BODY PLACEMENT
              </h3>
              <ul className="space-y-1.5 font-mono">
                {placements.map((p) => (
                  <li key={p.value}>
                    <button
                      onClick={() => setSelectedPlacement(p.value)}
                      className={`w-full text-left py-1 px-2 flex justify-between items-center transition-colors ${
                        selectedPlacement === p.value
                          ? 'bg-[#151515] text-[#D4AF37] font-bold border-l-2 border-[#D4AF37]'
                          : 'text-[#888888] hover:text-[#D4AF37]'
                      }`}
                    >
                      <span>{p.label}</span>
                      {selectedPlacement === p.value && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Size Filter */}
            <div>
              <h3 className="font-mono uppercase font-bold text-[#D4AF37] tracking-widest text-[11px] mb-3 pb-1 border-b border-[#252525]">
                SIZE
              </h3>
              <div className="grid grid-cols-3 gap-1.5">
                {['small', 'medium', 'large'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(selectedSize === s ? 'all' : s)}
                    className={`py-2 text-center font-mono uppercase text-[11px] border transition-colors ${
                      selectedSize === s
                        ? 'bg-[#8B0000] text-white border-[#8B0000] font-bold shadow-sm shadow-[#8B0000]/30'
                        : 'bg-[#111111] border-[#252525] text-[#A3A3A3] hover:border-[#D4AF37]/50 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="font-mono uppercase font-bold text-[#D4AF37] tracking-widest text-[11px] mb-3 pb-1 border-b border-[#252525]">
                PRICE
              </h3>
              <ul className="space-y-1.5 font-mono">
                {priceRanges.map((pr) => (
                  <li key={pr.value}>
                    <button
                      onClick={() => setSelectedPriceRange(pr.value)}
                      className={`w-full text-left py-1 px-2 flex justify-between items-center transition-colors ${
                        selectedPriceRange === pr.value
                          ? 'bg-[#151515] text-[#D4AF37] font-bold border-l-2 border-[#D4AF37]'
                          : 'text-[#888888] hover:text-[#D4AF37]'
                      }`}
                    >
                      <span>{pr.label}</span>
                      {selectedPriceRange === pr.value && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* In Stock Toggle */}
            <div className="pt-2 border-t border-[#252525]">
              <label className="flex items-center gap-2 cursor-pointer font-mono text-[#A3A3A3] hover:text-[#D4AF37] transition-colors">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded-none bg-[#111111] border-[#252525] text-[#8B0000] focus:ring-0"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Reset All */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="w-full py-2 bg-[#151515] hover:bg-[#202020] border border-[#252525] hover:border-[#D4AF37]/50 text-[#A3A3A3] hover:text-[#D4AF37] font-mono uppercase text-[11px] transition-colors"
              >
                CLEAR ALL FILTERS
              </button>
            )}
          </aside>

          {/* RIGHT: PRODUCTS CATALOGUE GRID */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-[#111111] animate-pulse border border-[#252525]" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-16 border border-[#252525] bg-[#0A0A0A] text-center space-y-4">
                <h3 className="text-base font-bold uppercase tracking-widest text-white">
                  NO TATTOOS FOUND
                </h3>
                <p className="text-xs text-[#666666] max-w-sm mx-auto">
                  We could not find any designs matching your specific combination of filters. Try clearing your filters or selecting a different category.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-[#8B0000] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#A30000] transition-colors shadow-lg shadow-[#8B0000]/20"
                >
                  RESET FILTERS
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#080808] border-l border-[#252525] p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-[#252525]">
                <span className="text-xs font-mono uppercase font-bold tracking-widest text-[#D4AF37]">
                  REFINE SEARCH
                </span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="text-[#A3A3A3] hover:text-[#D4AF37]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <span className="text-[11px] font-mono text-[#666666] uppercase tracking-wider block mb-2">
                  CATEGORY
                </span>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
                  {categories.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setSelectedCategory(c.value)}
                      className={`p-2 text-left border ${
                        selectedCategory === c.value
                          ? 'bg-[#8B0000] text-white border-[#8B0000] font-bold'
                          : 'bg-[#111111] border-[#252525] text-[#A3A3A3]'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <span className="text-[11px] font-mono text-[#666666] uppercase tracking-wider block mb-2">
                  PRICE RANGE
                </span>
                <div className="space-y-1 font-mono text-xs">
                  {priceRanges.map((pr) => (
                    <button
                      key={pr.value}
                      onClick={() => setSelectedPriceRange(pr.value)}
                      className={`w-full p-2 text-left border ${
                        selectedPriceRange === pr.value
                          ? 'bg-[#151515] text-[#D4AF37] border-[#D4AF37]'
                          : 'bg-[#111111] border-[#252525] text-[#A3A3A3]'
                      }`}
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#252525] space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-[#8B0000] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#A30000] transition-colors shadow-lg shadow-[#8B0000]/20"
              >
                APPLY FILTERS ({filteredProducts.length})
              </button>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="w-full py-2.5 bg-transparent border border-[#252525] text-[#A3A3A3] hover:text-[#D4AF37] font-mono uppercase text-xs"
                >
                  RESET
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
