import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FaqPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'HOW DOES TWILIGHT THINKS INK WORK?',
      a: 'Our tattoos use a 100% plant-based formula derived from the organic Genipa Americana (Jagua) fruit. When pressed onto skin with water for 60 seconds, the active compounds bind with amino acids in your epidermis. At first, the design looks very light or translucent, and then gradually oxidizes into deep midnight matte black over 24 to 36 hours.'
    },
    {
      q: 'HOW IS THIS DIFFERENT FROM TRADITIONAL STICKER TATTOOS?',
      a: 'Traditional temporary tattoos sit on top of your skin as a shiny, plasticky sticker that cracks, peels off in warm water, or sticks to your clothes. TWILIGHT THINKS sinks into the epidermis, giving it the exact matte look, skin texture, and aesthetic authenticity of fresh needlework.'
    },
    {
      q: 'HOW LONG DOES IT LAST?',
      a: 'On average, our tattoos last between 10 and 15 days. Placements that experience less friction (such as the inner forearm, bicep, collarbone, or calf) will last the longest. Areas subject to frequent washing or bending (like fingers or palms) typically last 6 to 9 days.'
    },
    {
      q: 'IS IT 100% WATERPROOF AND GYM PROOF?',
      a: 'Yes, completely. Once the ink has developed (after 24 hours), you can take hot showers, swim in chlorinated pools, surf in saltwater oceans, and sweat heavily at the gym. It will not run, peel, or smudge.'
    },
    {
      q: 'IS THE FORMULA SAFE FOR SENSITIVE SKIN?',
      a: 'Yes. Our formula is cruelty-free, vegan, dermatologically tested, and free of toxic PPD (which is commonly found in black henna). However, if you have a known severe allergy to fruit extracts, we recommend testing a small spot first.'
    },
    {
      q: 'HOW DO I REMOVE IT EARLY IF DESIRED?',
      a: 'Because the ink penetrates the top skin layer, you cannot simply wipe it off with water. To accelerate fading, gently exfoliate the area daily in a warm shower using an exfoliating scrub, loofah, or baby oil with warm water.'
    },
    {
      q: 'HOW DOES THE CUSTOM TATTOO STUDIO WORK?',
      a: 'In our Custom Tattoo Builder, you can choose your type (Text, Artwork, Photo, Symbol, or QR), upload your file or enter words, select body placement and dimensions, and inspect a live real-time simulation. Our studio artists optimize the stencil resolution and produce your bespoke transfer sheet within 24 hours.'
    },
    {
      q: 'WHAT ARE THE SHIPPING TIMELINES?',
      a: 'Orders are dispatched within 24 hours from our Mumbai studio. Standard domestic shipping arrives in 3–5 business days. Express courier arrives in 1–2 business days. Shipping is completely free on all orders over ₹799.'
    }
  ];

  return (
    <div className="pt-24 pb-20 bg-[#050505] min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 pt-8">
          <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-2">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-sans">
            KNOWLEDGE BASE
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#A3A3A3] font-light">
            Everything you need to know about our plant-based Jagua formula, application, and care.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="bg-[#0A0A0A] border border-[#252525] hover:border-[#D4AF37]/30 transition-colors">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex justify-between items-center hover:text-[#D4AF37] transition-colors"
                >
                  <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-white">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#A3A3A3] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-[#888888] font-light leading-relaxed border-t border-[#1a1a1a] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Help Card */}
        <div className="mt-16 p-8 bg-[#0E0E0E] border border-[#252525] text-center space-y-4">
          <h3 className="text-base font-bold uppercase tracking-wider text-white">
            STILL HAVE UNANSWERED INQUIRIES?
          </h3>
          <p className="text-xs text-[#888888] max-w-md mx-auto">
            Our master artists and client concierge are on standby to guide your tattoo selection.
          </p>
          <Link
            to="/contact"
            className="inline-block px-6 py-3 bg-[#8B0000] text-white font-bold uppercase text-xs tracking-widest hover:bg-[#A30000] transition-colors shadow-lg shadow-[#8B0000]/20"
          >
            CONTACT STUDIO
          </Link>
        </div>
      </div>
    </div>
  );
};
