import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User as UserIcon, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, openDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'SHOP', path: '/shop' },
    { name: 'MEN', path: '/shop/men' },
    { name: 'WOMEN', path: '/shop/women' },
    { name: 'ANIME', path: '/shop/anime' },
    { name: 'COLLECTIONS', path: '/shop' },
    { name: 'CUSTOM TATTOO', path: '/custom-tattoo', highlight: true }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#050505]/95 backdrop-blur-md border-b border-[#252525] py-3.5 shadow-xl'
            : 'bg-transparent border-b border-[#252525]/50 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* LEFT: Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2 group tracking-widest text-lg md:text-xl font-black text-white hover:text-[#D4AF37] transition-colors uppercase font-sans"
          >
            <span className="w-2 h-2 bg-[#D4AF37] rounded-full inline-block group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(212,175,55,0.7)]"></span>
            <span>TWILIGHT THINKS</span>
          </Link>

          {/* CENTER: Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold tracking-widest uppercase">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`transition-all duration-200 relative py-1 ${
                    link.highlight
                      ? 'text-[#D4AF37] border-b border-[#D4AF37] hover:text-[#E0C36E]'
                      : isActive
                      ? 'text-[#D4AF37]'
                      : 'text-[#B8B8B8] hover:text-[#D4AF37]'
                  }`}
                >
                  {link.name}
                  {isActive && !link.highlight && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Action Icons */}
          <div className="flex items-center space-x-4 md:space-x-5">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="text-[#B8B8B8] hover:text-[#D4AF37] transition-colors p-1"
              aria-label="Search tattoos"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="text-[#B8B8B8] hover:text-[#D4AF37] transition-colors p-1 relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#8B0000] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link
              to={isAuthenticated ? '/account' : '/login'}
              className="hidden sm:flex text-[#B8B8B8] hover:text-[#D4AF37] transition-colors p-1 items-center gap-1.5"
              aria-label="Account"
            >
              <UserIcon className="w-5 h-5" />
              {isAuthenticated && (
                <span className="text-[11px] font-medium tracking-wider max-w-[70px] truncate text-[#B8B8B8]">
                  {user?.name.split(' ')[0]}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={openDrawer}
              className="text-white hover:text-[#D4AF37] transition-colors p-1 relative flex items-center"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#8B0000] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-[#B8B8B8] hover:text-[#D4AF37] transition-colors p-1"
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Global Search Overlay Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col justify-start pt-24 px-4 sm:px-8"
          >
            <div className="max-w-3xl mx-auto w-full">
              <div className="flex justify-between items-center pb-6 border-b border-[#252525]">
                <span className="text-xs uppercase font-mono tracking-widest text-[#D4AF37]">
                  SEARCH THE DARK CATALOGUE
                </span>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-[#B8B8B8] hover:text-[#D4AF37] p-2 transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSearchSubmit} className="mt-8 relative">
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by serpent, dragon, anime, placement or tag..."
                  className="w-full bg-transparent text-xl sm:text-2xl text-white placeholder-[#777777] border-none outline-none tracking-wide pb-4 font-light"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[#D4AF37] hover:text-white hover:translate-x-1 transition-all"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </form>

              <div className="mt-10">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#777777] block mb-3">
                  POPULAR SEARCHES
                </span>
                <div className="flex flex-wrap gap-2">
                  {['Midnight Serpent', 'Japanese Oni', 'Anime', 'Minimalist', 'Collarbone', 'Finger Tattoos', 'Wolf'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        navigate(`/search?q=${encodeURIComponent(term)}`);
                        setSearchOpen(false);
                      }}
                      className="px-3 py-1.5 bg-[#0B0B0B] hover:bg-[#8B0000]/20 text-xs text-[#B8B8B8] hover:text-[#D4AF37] border border-[#252525] hover:border-[#D4AF37]/50 transition-all"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#080808] border-l border-[#252525] p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex justify-between items-center pb-6 border-b border-[#252525]">
                  <span className="text-sm font-black tracking-widest uppercase flex items-center gap-2 text-white">
                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full inline-block"></span>
                    TWILIGHT THINKS
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#B8B8B8] hover:text-[#D4AF37]"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex flex-col space-y-4 py-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`text-base font-bold tracking-widest uppercase transition-colors ${
                        link.highlight
                          ? 'text-[#D4AF37] border-l-2 border-[#D4AF37] pl-2'
                          : 'text-[#B8B8B8] hover:text-[#D4AF37]'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-[#252525] space-y-4">
                <Link
                  to={isAuthenticated ? '/account' : '/login'}
                  className="flex items-center gap-3 text-sm text-[#B8B8B8] hover:text-[#D4AF37]"
                >
                  <UserIcon className="w-5 h-5" />
                  <span>{isAuthenticated ? 'My Account' : 'Sign In / Register'}</span>
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center gap-3 text-sm text-[#B8B8B8] hover:text-[#D4AF37]"
                >
                  <Heart className="w-5 h-5" />
                  <span>Wishlist ({wishlistCount})</span>
                </Link>
                <div className="pt-4 text-xs font-mono text-[#777777]">
                  PREMIUM SEMI-PERMANENT INK • GEN-Z STUDIO
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
