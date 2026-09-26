import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  Check,
  ChevronDown,
  ChevronUp,
  Droplets,
  Clock,
  Shield,
  MessageCircle,
  Sparkles,
  MapPin,
  Share2
} from 'lucide-react';
import { api } from '../../services/api';
import { Product, StudioSettings } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { ProductCard } from '../../components/common/ProductCard';
import { buildWhatsAppUrl, buildTattooEnquiryMessage } from '../../utils/whatsapp';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('Medium');
  const [loading, setLoading] = useState<boolean>(true);
  const [settings, setSettings] = useState<StudioSettings | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>('apply');

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await api.getProduct(slug);
        if (res.success && res.product) {
          setProduct(res.product);
          setSelectedImage(res.product.images?.[0] || '');
          if (res.product.sizes?.length) {
            setSelectedSize(res.product.sizes[0]);
          }

          // Fetch related
          const relRes = await api.getProducts({ category: res.product.category, limit: 4 });
          if (relRes.success) {
            setRelatedProducts(relRes.products.filter((p) => p.slug !== slug).slice(0, 4));
          }
        }
      } catch (err) {
        console.error('[ProductDetail] Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.getSettings();
        if (res.success && res.settings) {
          setSettings(res.settings);
        }
      } catch (err) {
        console.warn('[ProductDetail] Could not load studio settings:', err);
      }
    };
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3 font-mono text-xs text-[#A3A3A3]">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>LOADING INK DETAILS...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#050505] text-center text-white flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold uppercase tracking-widest font-mono">TATTOO NOT FOUND</h2>
        <p className="text-xs text-[#666666]">The design you are looking for has retired from our dark archive.</p>
        <Link
          to="/shop"
          className="px-6 py-2.5 bg-white text-black font-bold uppercase text-xs tracking-widest"
        >
          EXPLORE CATALOGUE
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product._id);

  const handleWhatsAppEnquiry = () => {
    if (!product) return;
    const message = buildTattooEnquiryMessage({
      name: product.name,
      price: product.price,
      category: product.category,
      placement: product.placement,
      slug: product.slug
    });
    const phone = settings?.whatsapp || settings?.phone || '+91 98200 12345';
    const url = buildWhatsAppUrl(phone, message);
    window.open(url, '_blank');
  };

  const toggleAcc = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const accordions = [
    {
      id: 'desc',
      title: 'DESCRIPTION & INSPIRATION',
      content: product.description
    },
    {
      id: 'apply',
      title: 'HOW TO APPLY & REALISM DEVELOPMENT',
      content:
        '1. Clean skin thoroughly with alcohol wipe and dry completely.\n2. Peel off clear protective film and place tattoo face down on skin.\n3. Hold damp cloth firmly over stencil for 60 seconds.\n4. Gently remove backing paper and air dry for 5 minutes.\n5. Ink develops into full midnight matte realism over 24-36 hours.'
    },
    {
      id: 'duration',
      title: 'HOW LONG DOES IT LAST?',
      content:
        'TWILIGHT THINKS semi-permanent tattoos typically last between 10 to 15 days depending on body placement, skin moisture, and exfoliation frequency. Placements like the inner forearm, shoulder, and ribs last the longest.'
    },
    {
      id: 'waterproof',
      title: 'IS IT WATERPROOF?',
      content:
        'Yes, 100% waterproof. Once the botanical Jagua ink penetrates into the epidermis, it bonds with your skin amino acids. You can shower, swim in the ocean or pool, and workout without fading.'
    },
    {
      id: 'safety',
      title: 'SKIN SAFETY & INGREDIENTS',
      content:
        'Crafted with Genipa Americana fruit juice extract, water, ethyl alcohol, and xanthan gum. 100% plant-based, vegan, cruelty-free, and dermatologically tested. Free of toxic PPD and chemical dyes.'
    },
    {
      id: 'studio',
      title: 'STUDIO LOCATION & APPOINTMENTS',
      content: `Flagship Studio: ${settings?.address || '42 Obsidian Avenue, Colaba Arts District, Mumbai 400005'}\nOperating Hours: ${settings?.openingHours || settings?.hours || 'Mon–Sun, 11am–9pm IST'}\n\nEnquire directly on WhatsApp to reserve this design or schedule a studio appointment with our resident artists.`
    }
  ];

  return (
    <div className="pt-24 pb-20 bg-[#050505] min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="text-[11px] font-mono text-[#666666] uppercase tracking-wider mb-8 flex items-center gap-2">
          <Link to="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#D4AF37] transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/shop/${product.category.toLowerCase()}`} className="hover:text-[#D4AF37] transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-[#D4AF37]">{product.name}</span>
        </div>

        {/* 2-Column Product Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* LEFT: Image Gallery (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Main Image */}
            <div className="relative aspect-[4/5] bg-[#111111] border border-[#252525] overflow-hidden group">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>

            {/* Thumbnail Row */}
            {product.images && product.images.length > 1 && (
              <div className="flex flex-wrap gap-3 pt-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-20 sm:w-20 sm:h-24 bg-[#111111] border transition-all overflow-hidden relative ${
                      selectedImage === img
                        ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]'
                        : 'border-[#252525] opacity-60 hover:opacity-100 hover:border-[#D4AF37]/50'
                    }`}
                    aria-label={`Select image ${i + 1}`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=300&q=80';
                      }}
                    />
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 bg-black/80 text-[8px] font-mono text-[#D4AF37] px-1 uppercase border border-[#D4AF37]/40">
                        MAIN
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Information & Controls (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#888888] uppercase mb-2">
                <span>CATEGORY: <span className="text-[#D4AF37]">{product.category}</span></span>
                {product.gender && <span>GENDER: <span className="text-white">{product.gender}</span></span>}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-sans text-white">
                {product.name}
              </h1>

              {/* Product Badges */}
              {((product.comparePrice && product.comparePrice > product.price) ||
                product.bestSeller ||
                product.newArrival ||
                product.trending) && (
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {product.comparePrice && product.comparePrice > product.price && (
                    <span className="bg-[#8B0000] text-white text-[10px] font-mono font-bold px-2 py-0.5 tracking-wider uppercase">
                      {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                    </span>
                  )}
                  {product.bestSeller && (
                    <span className="bg-[#D4AF37] text-black font-black text-[9px] font-mono px-2 py-0.5 tracking-wider uppercase shadow-sm">
                      BESTSELLER
                    </span>
                  )}
                  {product.newArrival && (
                    <span className="bg-[#0A0A0A] text-[#D4AF37] border border-[#D4AF37]/50 text-[9px] font-mono px-2 py-0.5 tracking-wider uppercase">
                      NEW ARRIVAL
                    </span>
                  )}
                  {product.trending && (
                    <span className="bg-[#5C0000] text-white text-[9px] font-mono px-2 py-0.5 tracking-wider uppercase">
                      TRENDING
                    </span>
                  )}
                </div>
              )}

              {/* Rating */}
              <div className="flex items-center gap-3 mt-3 pb-4 border-b border-[#1f1f1f]">
                <div className="flex items-center text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-[#D4AF37] text-[#D4AF37]'
                          : 'fill-transparent text-[#444444]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-mono text-white font-bold">{product.rating}</span>
                <span className="text-xs font-mono text-[#666666]">
                  ({product.reviewCount || 108} reviews)
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                ₹{product.price}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-base font-mono text-[#666666] line-through">
                  ₹{product.comparePrice}
                </span>
              )}
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-xs font-mono text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-2 py-0.5">
                  Save ₹{product.comparePrice - product.price}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed font-light">
              {product.description.slice(0, 160)}...
            </p>

            {/* Tattoo Placement & Specifications */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-[#0d0d0d] border border-[#252525]">
                <span className="text-[10px] font-mono text-[#666666] uppercase block">RECOMMENDED PLACEMENT</span>
                <span className="text-xs font-mono text-white font-bold">
                  {Array.isArray(product.placement) && product.placement.length > 0
                    ? product.placement.join(', ')
                    : product.placement || 'Forearm, Chest, Calf'}
                </span>
              </div>
              <div className="p-3 bg-[#0d0d0d] border border-[#252525]">
                <span className="text-[10px] font-mono text-[#666666] uppercase block">STUDIO AVAILABILITY</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${product.available !== false ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <span className={`text-xs font-mono font-bold ${product.available !== false ? 'text-emerald-400' : 'text-red-400'}`}>
                    {product.available !== false ? 'AVAILABLE IN STUDIO' : 'CURRENTLY UNAVAILABLE'}
                  </span>
                </div>
              </div>
            </div>

            {/* Size Selector if available */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#A3A3A3] uppercase">RECOMMENDED STENCIL SIZE</span>
                  <span className="text-[#D4AF37] font-bold">{selectedSize}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2 text-center font-mono text-xs uppercase border transition-all ${
                        selectedSize === sz
                          ? 'bg-[#8B0000] text-white border-[#8B0000] font-bold shadow-md shadow-[#8B0000]/30'
                          : 'bg-[#111111] border-[#252525] text-[#A3A3A3] hover:border-[#D4AF37]/50'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Primary Action: Direct WhatsApp Booking & Enquiry */}
            <div className="space-y-2.5 pt-3">
              <button
                onClick={handleWhatsAppEnquiry}
                id="i-want-this-tattoo-btn"
                className="w-full py-4 bg-[#8B0000] hover:bg-[#A30000] active:scale-[0.99] text-white font-black uppercase text-xs sm:text-sm tracking-widest transition-all shadow-xl shadow-[#8B0000]/30 flex items-center justify-center gap-2.5"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                I WANT THIS TATTOO • ENQUIRE ON WHATSAPP
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleWishlist(product._id, product.name)}
                  className="flex-1 py-3 bg-[#111111] border border-[#252525] hover:border-[#D4AF37]/50 text-white transition-all flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-wider"
                  aria-label="Wishlist toggle"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorited ? 'fill-[#8B0000] text-[#8B0000]' : 'text-[#A3A3A3]'
                    }`}
                  />
                  <span>{isFavorited ? 'SAVED TO ARCHIVE' : 'SAVE TO WISHLIST'}</span>
                </button>

                <Link
                  to="/custom-tattoo"
                  className="flex-1 py-3 bg-transparent border border-[#D4AF37]/50 hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] transition-all flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-wider text-center"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>CUSTOMIZE DESIGN</span>
                </Link>
              </div>

              {/* Studio Direct Assurance Box */}
              <div className="p-3 bg-[#0d0d0d] border border-[#252525] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                  <span className="font-bold">STUDIO DIRECT WHATSAPP CONSULTATION</span>
                </div>
                <p className="text-[11px] text-[#888888] font-light leading-relaxed">
                  Clicking opens WhatsApp with this tattoo's name ({product.name}) and pricing (₹{product.price.toLocaleString('en-IN')}) pre-filled to confirm placement, booking slot, or studio visit.
                </p>
              </div>
            </div>

            {/* Accordions */}
            <div className="pt-6 border-t border-[#1f1f1f] space-y-2">
              {accordions.map((acc) => {
                const isOpen = openAccordion === acc.id;
                return (
                  <div key={acc.id} className="border border-[#252525] bg-[#0A0A0A]">
                    <button
                      onClick={() => toggleAcc(acc.id)}
                      className="w-full p-4 flex items-center justify-between text-left hover:text-[#D4AF37] transition-colors"
                    >
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#E8E8E8]">
                        {acc.title}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#D4AF37]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#A3A3A3]" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-[#888888] font-light leading-relaxed whitespace-pre-line border-t border-[#1a1a1a] pt-3">
                        {acc.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-28 pt-16 border-t border-[#1f1f1f]">
            <div className="mb-8">
              <span className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-1">
                COMPLEMENTARY INK
              </span>
              <h2 className="text-2xl font-black uppercase tracking-tight font-sans text-white">
                YOU MAY ALSO COVET
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
