import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Droplets } from 'lucide-react';

interface HeroSectionProps {
  cmsData?: any;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ cmsData }) => {
  const content = cmsData?.content || {};
  const title = cmsData?.title || 'TWILIGHT THINKS';
  const subtitle =
    cmsData?.subtitle ||
    'Semi-permanent tattoos designed for personal style, self-expression and experimentation.';
  const primaryCta = content.primaryCta || 'SHOP TATTOOS';
  const primaryCtaLink = content.primaryCtaLink || '/shop';
  const secondaryCta = content.secondaryCta || 'CREATE YOUR OWN';
  const secondaryCtaLink = content.secondaryCtaLink || '/custom-tattoo';
  const heroImage =
    content.heroImage ||
    'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1600&q=85';

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#050505] pt-20">
      {/* Background Cinematic Image with Dark Editorial Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Twilight Thinks Editorial Tattoo"
          className="w-full h-full object-cover object-center opacity-35 scale-105 transform animate-pulse-subtle"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-[#050505]/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#050505]/40 to-[#050505]" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
        {/* Subtle Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#0D0D0D]/90 backdrop-blur-md border border-[#D4AF37]/30 text-[11px] font-mono tracking-widest text-[#D4AF37] uppercase mb-6 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.15)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000] animate-ping"></span>
          <span>{cmsData?.badge || 'NEW GENERATION PLANT-BASED INK'}</span>
        </motion.div>

        {/* Main Brand Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase font-sans leading-[0.95]"
        >
          {title}
        </motion.h1>

        {/* Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-6 text-sm sm:text-base md:text-lg text-[#B8B8B8] max-w-2xl mx-auto leading-relaxed font-light tracking-wide"
        >
          {subtitle}
        </motion.p>

        {/* Dual CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
        >
          <Link
            to={primaryCtaLink}
            className="w-full sm:w-auto px-8 py-4 bg-[#8B0000] text-white hover:bg-[#A30000] text-xs font-bold tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 group shadow-[0_4px_25px_rgba(139,0,0,0.4)]"
          >
            <span>{primaryCta}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to={secondaryCtaLink}
            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-[#D4AF37]/60 hover:border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-xs font-bold tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{secondaryCta}</span>
          </Link>
        </motion.div>

        {/* Formula Pillars Bar Below Hero */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 pt-8 border-t border-[#1f1f1f] grid grid-cols-3 gap-2 sm:gap-6 text-center"
        >
          <div className="flex flex-col items-center">
            <span className="text-[10px] sm:text-xs font-mono uppercase text-[#D4AF37] font-bold tracking-wider">
              1–2 WEEKS
            </span>
            <span className="text-[9px] sm:text-[11px] text-[#777777]">FADES NATURALLY</span>
          </div>
          <div className="flex flex-col items-center border-x border-[#1f1f1f]">
            <span className="text-[10px] sm:text-xs font-mono uppercase text-[#D4AF37] font-bold tracking-wider">
              100% WATERPROOF
            </span>
            <span className="text-[9px] sm:text-[11px] text-[#777777]">GYM & POOL SAFE</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] sm:text-xs font-mono uppercase text-[#D4AF37] font-bold tracking-wider">
              ORGANIC JAGUA
            </span>
            <span className="text-[9px] sm:text-[11px] text-[#777777]">DERM TESTED</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
