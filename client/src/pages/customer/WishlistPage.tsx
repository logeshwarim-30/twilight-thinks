import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { Product } from '../../types';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await api.getProducts();
        if (res.success) {
          setProducts(res.products);
        }
      } catch (err) {
        console.error('[Wishlist] Failed to fetch catalogue:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  const wishlistProducts = products.filter((p) => wishlist.includes(p._id));

  const handleMoveToBag = (product: Product) => {
    addToCart({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images?.[0] || '',
      size: product.sizes?.[0] || 'Medium',
      quantity: 1,
      price: product.price
    });
    toggleWishlist(product._id, product.name);
    showToast(`${product.name} moved to bag`, 'success');
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-[60vh] bg-[#050505] flex items-center justify-center text-white font-mono text-xs">
        LOADING YOUR SAVED INK...
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="pt-32 pb-24 min-h-[70vh] bg-[#050505] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-[#111111] border border-[#252525] flex items-center justify-center text-[#666666] mb-4">
          <Heart className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-2 font-sans">
          YOUR WISHLIST IS EMPTY
        </h1>
        <p className="text-xs sm:text-sm text-[#888888] max-w-sm mb-8 font-light">
          Save your favorite designs here by tapping the heart icon on any tattoo card.
        </p>
        <Link
          to="/shop"
          className="px-8 py-3.5 bg-[#8B0000] text-white font-bold uppercase text-xs tracking-widest hover:bg-[#A30000] transition-colors shadow-lg shadow-[#8B0000]/20"
        >
          EXPLORE CATALOGUE
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-[#050505] min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 pb-4 border-b border-[#1f1f1f] flex items-baseline justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#D4AF37] tracking-widest block">
              SAVED OBSESSIONS
            </span>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight font-sans text-white">
              MY WISHLIST ({wishlistProducts.length})
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistProducts.map((p) => (
            <div
              key={p._id}
              className="bg-[#0A0A0A] border border-[#252525] hover:border-[#D4AF37]/50 transition-colors flex flex-col justify-between group"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#111111]">
                <img
                  src={p.images?.[0]}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  onClick={() => toggleWishlist(p._id, p.name)}
                  className="absolute top-2.5 right-2.5 p-2 bg-black/60 rounded-full hover:bg-black text-[#A3A3A3] hover:text-[#B11226] transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <div className="text-[10px] font-mono text-[#D4AF37] uppercase mb-1">
                    {p.category}
                  </div>
                  <Link
                    to={`/product/${p.slug}`}
                    className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white hover:text-[#D4AF37] transition-colors line-clamp-1"
                  >
                    {p.name}
                  </Link>
                  <div className="text-xs font-bold font-mono text-[#D4AF37] mt-1">
                    ₹{p.price}
                  </div>
                </div>

                <button
                  onClick={() => handleMoveToBag(p)}
                  className="mt-4 w-full py-2.5 bg-[#8B0000] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#A30000] transition-colors shadow-md shadow-[#8B0000]/20"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>MOVE TO BAG</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
