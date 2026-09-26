import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { Product } from '../../types';
import { ProductCard } from '../../components/common/ProductCard';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [inputVal, setInputVal] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInputVal(query);
    if (!query) return;

    const performSearch = async () => {
      setLoading(true);
      try {
        const res = await api.getProducts({ search: query });
        if (res.success) {
          setProducts(res.products);
        }
      } catch (err) {
        console.error('[Search] Error querying products:', err);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchParams({ q: inputVal.trim() });
    }
  };

  return (
    <div className="pt-24 pb-20 bg-[#050505] min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Input Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block text-center mb-3">
            DARK ARCHIVE QUERY
          </span>
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Search tattoos, placement, dragon, anime, viper..."
              className="w-full bg-[#0A0A0A] border border-[#252525] focus:border-[#D4AF37] pl-12 pr-12 py-4 text-sm sm:text-base font-mono text-white placeholder-[#666666] focus:outline-none"
            />
            <SearchIcon className="w-5 h-5 text-[#666666] absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[#8B0000] text-white hover:bg-[#A30000] transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs font-mono text-[#666666]">
            <span>QUICK SEARCH:</span>
            {['Serpent', 'Dragon', 'Oni', 'Rose', 'Wolf', 'Minimal', 'Anime'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setInputVal(tag);
                  setSearchParams({ q: tag });
                }}
                className="px-2.5 py-1 bg-[#111111] hover:bg-[#1a1a1a] text-[#A3A3A3] hover:text-[#D4AF37] border border-[#252525] hover:border-[#D4AF37]/40 text-[11px] transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-8 pb-4 border-b border-[#1f1f1f] flex justify-between items-baseline">
          <h2 className="text-xl font-bold uppercase tracking-tight font-sans">
            {query ? `RESULTS FOR "${query}" (${products.length})` : 'ENTER A SEARCH TERM'}
          </h2>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="p-16 text-center text-xs font-mono text-[#666666]">
            SEARCHING ARCHIVE...
          </div>
        ) : query && products.length === 0 ? (
          <div className="p-16 bg-[#0A0A0A] border border-[#252525] text-center space-y-4 max-w-xl mx-auto">
            <h3 className="text-base font-bold uppercase tracking-wider text-white">
              NO DESIGNS MATCHED YOUR QUERY
            </h3>
            <p className="text-xs text-[#888888] font-light">
              We could not find any tattoos matching "{query}". You can customize your own bespoke design in our studio builder.
            </p>
            <Link
              to="/custom-tattoo"
              className="inline-block px-6 py-2.5 bg-[#8B0000] text-white font-bold uppercase text-xs tracking-widest hover:bg-[#A30000] transition-colors shadow-lg shadow-[#8B0000]/20"
            >
              CREATE CUSTOM INK
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
