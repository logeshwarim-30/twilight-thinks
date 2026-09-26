import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Upload,
  Type,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  QrCode,
  Image as ImageIcon,
  Layers,
  ShoppingBag,
  Info,
  Calendar,
  Clock,
  Send,
  CheckCircle2
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const CustomTattooPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Customization State
  const [selectedType, setSelectedType] = useState<string>('Custom Artwork');
  const [uploadedImage, setUploadedImage] = useState<string>(
    'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=600&q=80'
  );
  const [tattooIdea, setTattooIdea] = useState<string>('Dark Serpent & Crescent');
  const [requiredChanges, setRequiredChanges] = useState<string>('Darker shading, finer linework than reference image');
  const [customText, setCustomText] = useState<string>('Solitude in Motion');
  const [selectedFont, setSelectedFont] = useState<string>('Gothic Serif');
  const [selectedPlacement, setSelectedPlacement] = useState<string>('Arm');
  const [selectedSize, setSelectedSize] = useState<'Small' | 'Medium' | 'Large'>('Medium');
  const [budget, setBudget] = useState<string>('₹2,000 - ₹3,500');
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [preferredTime, setPreferredTime] = useState<string>('');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name || '');
      if (!customerEmail) setCustomerEmail(user.email || '');
      if (!customerPhone && user.phone) setCustomerPhone(user.phone || '');
    }
  }, [user]);

  const resetForm = () => {
    setSubmittedRequestId(null);
    setCurrentStep(1);
    setTattooIdea('');
    setRequiredChanges('');
    setCustomText('');
    setSpecialNotes('');
  };

  // Dynamic Pricing Calculation
  const basePrice = 399;
  const sizeCost = selectedSize === 'Large' ? 100 : selectedSize === 'Medium' ? 50 : 0;
  const typeCost = selectedType === 'Custom Artwork' ? 150 : selectedType === 'Photo' ? 100 : 0;
  const totalPrice = basePrice + sizeCost + typeCost;

  // Types list
  const types = [
    { id: 'Custom Artwork', title: 'Custom Artwork / Reference', icon: Sparkles, desc: 'Provide reference image with your desired changes' },
    { id: 'Text', title: 'Typography / Name', icon: Type, desc: 'Cursive scripts, gothic quotes, names or coordinates' },
    { id: 'Photo', title: 'Photo to Stencil', icon: ImageIcon, desc: 'Turn portrait, pet photo, or landscape into ink stencil' },
    { id: 'Symbol', title: 'Symbol / Sigil', icon: Layers, desc: 'Alchemical marks, sacred geometry, or runes' },
    { id: 'QR', title: 'Interactive Audio/QR', icon: QrCode, desc: 'Scannable Spotify playlist, voice note, or link' }
  ];

  // Placements
  const placements = [
    { id: 'Arm', name: 'Inner / Outer Forearm', duration: '12–15 Days' },
    { id: 'Wrist', name: 'Inner Wrist', duration: '10–12 Days' },
    { id: 'Neck', name: 'Side / Back of Neck', duration: '8–10 Days' },
    { id: 'Chest', name: 'Upper Chest / Collarbone', duration: '12–15 Days' },
    { id: 'Back', name: 'Shoulder Blades / Spine', duration: '14–16 Days' },
    { id: 'Finger', name: 'Side of Fingers', duration: '6–8 Days' },
    { id: 'Ankle', name: 'Ankle / Outer Calf', duration: '12–14 Days' }
  ];

  // Fonts
  const fonts = [
    { id: 'Gothic Serif', style: 'font-serif tracking-widest uppercase' },
    { id: 'Minimalist Sans', style: 'font-sans font-light tracking-wide' },
    { id: 'Cyberpunk Mono', style: 'font-mono uppercase font-bold' },
    { id: 'Old English Calligraphy', style: 'italic font-serif' },
    { id: 'Japanese Katakana Style', style: 'tracking-ultra uppercase' }
  ];

  // Sizes
  const sizes = [
    { id: 'Small', label: 'Small', dimensions: '2" x 2" (5 x 5 cm)', priceAdd: '+₹0', desc: 'Best for fingers, wrist, and behind ear' },
    { id: 'Medium', label: 'Medium', dimensions: '4" x 4" (10 x 10 cm)', priceAdd: '+₹50', desc: 'Best for inner forearm, bicep, ankle' },
    { id: 'Large', label: 'Large', dimensions: '7" x 5" (18 x 12 cm)', priceAdd: '+₹100', desc: 'Best for full forearm, chest, shoulder blades' }
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      try {
        const res = await api.uploadImage(file);
        if (res.success && res.url) {
          setUploadedImage(res.url);
          showToast('Reference image uploaded to studio server', 'success');
        }
      } catch (err: any) {
        console.warn('Server upload fallback:', err.message);
      }
    }
  };

  const handleFinalSubmit = async () => {
    const finalEmail = customerEmail.trim() || user?.email || '';
    if (!finalEmail) {
      showToast('Please provide your contact email for your studio quote', 'error');
      return;
    }
    if (!customerName.trim() && !user?.name) {
      showToast('Please provide your full name', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.createCustomTattoo({
        customer: {
          name: customerName.trim() || user?.name || 'Studio Collector',
          email: finalEmail,
          phone: customerPhone.trim() || user?.phone || ''
        },
        type: selectedType,
        style: selectedType,
        tattooIdea: tattooIdea.trim() || customText.trim() || 'Custom Reference Tattoo',
        customText,
        font: selectedFont,
        description: requiredChanges.trim() || specialNotes.trim() || 'Custom reference tattoo request',
        requiredChanges: requiredChanges.trim() || specialNotes.trim(),
        placement: selectedPlacement,
        size: selectedSize,
        artworkUrl: uploadedImage,
        budget,
        preferredDate,
        preferredTime,
        notes: specialNotes
      });

      if (res.success && res.customTattoo) {
        setSubmittedRequestId(res.customTattoo.requestId);
        showToast('Custom tattoo request submitted to studio atelier!', 'success');
      } else {
        showToast('Request received by studio atelier!', 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'Error processing custom tattoo request', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-[#050505] min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-2">
            STUDIO BESPOKE LAB
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight font-sans">
            CREATE YOUR OWN TATTOO
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#A3A3A3] font-light leading-relaxed">
            Upload a reference image or idea, describe your desired modifications, and our resident artists
            will engineer your bespoke semi-permanent tattoo stencil and quote your project.
          </p>
        </div>

        {submittedRequestId ? (
          /* Studio Request Submission Confirmation */
          <div className="max-w-2xl mx-auto bg-[#0A0A0A] border border-[#252525] p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-[#8B0000]/10 rounded-full flex items-center justify-center mx-auto text-[#D4AF37] border border-[#D4AF37]/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#D4AF37] bg-[#151515] border border-[#D4AF37]/30 px-3 py-1">
                REQUEST ID #{submittedRequestId}
              </span>
              <h2 className="text-2xl font-bold uppercase tracking-tight text-white mt-4">
                CUSTOM TATTOO REQUEST SUBMITTED
              </h2>
              <p className="text-xs text-[#A3A3A3] mt-2 font-light leading-relaxed max-w-lg mx-auto">
                Your reference image and custom design requirements have been received by the Twilight Thinks studio atelier.
                Our artists will review your adjustments and prepare your official studio quote.
              </p>
            </div>

            {/* Workflow steps */}
            <div className="bg-[#111111] border border-[#252525] p-5 text-left text-xs font-mono space-y-3">
              <div className="text-[10px] uppercase text-[#D4AF37] tracking-wider font-bold">
                STUDIO QUOTATION WORKFLOW
              </div>
              <div className="flex items-start gap-3 text-[#CCCCCC]">
                <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                <span>Artist reviews your uploaded reference image and requested changes.</span>
              </div>
              <div className="flex items-start gap-3 text-[#CCCCCC]">
                <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                <span>Studio admin calculates and inputs your personalized price quote.</span>
              </div>
              <div className="flex items-start gap-3 text-[#CCCCCC]">
                <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                <span>You view the quote in your Account and click "Confirm & Accept" to proceed.</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/account?tab=custom-requests"
                className="w-full sm:w-auto px-6 py-3.5 bg-[#8B0000] text-white hover:bg-[#A30000] text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#8B0000]/20"
              >
                <span>TRACK QUOTATION IN MY ACCOUNT</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={resetForm}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#151515] border border-[#252525] hover:border-[#D4AF37]/50 text-xs font-mono uppercase text-[#A3A3A3] hover:text-[#D4AF37] transition-colors"
              >
                SUBMIT ANOTHER DESIGN
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Progress Step Indicator */}
            <div className="max-w-4xl mx-auto mb-10 pb-6 border-b border-[#1f1f1f] overflow-x-auto">
              <div className="flex items-center justify-between min-w-[500px]">
                {['1. TYPE', '2. UPLOAD', '3. ADJUSTMENTS', '4. PLACEMENT', '5. SIZE', '6. CONTACT & QUOTE'].map(
                  (stepTitle, idx) => {
                    const stepNum = idx + 1;
                    const isActive = currentStep === stepNum;
                    const isPassed = currentStep > stepNum;
                    return (
                      <button
                        key={stepTitle}
                        onClick={() => setCurrentStep(stepNum)}
                        className="flex flex-col items-center gap-2 group"
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono transition-all ${
                            isActive
                              ? 'bg-[#8B0000] text-white font-bold ring-4 ring-[#8B0000]/20'
                              : isPassed
                              ? 'bg-[#D4AF37] text-black font-bold'
                              : 'bg-[#151515] border border-[#252525] text-[#666666]'
                          }`}
                        >
                          {isPassed ? <Check className="w-3.5 h-3.5" /> : stepNum}
                        </div>
                        <span
                          className={`text-[10px] font-mono uppercase tracking-wider ${
                            isActive ? 'text-[#D4AF37] font-bold' : 'text-[#666666]'
                          }`}
                        >
                          {stepTitle}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Main Interactive Stage */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
              {/* Left Form Step Area (7 Cols) */}
              <div className="lg:col-span-7 bg-[#0A0A0A] border border-[#252525] p-6 sm:p-8 flex flex-col justify-between">
                {/* STEP 1: Select Type */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono uppercase text-[#D4AF37] tracking-widest">
                      STEP 1 OF 6
                    </span>
                    <h2 className="text-xl font-bold uppercase tracking-tight text-white font-sans">
                      CHOOSE TATTOO FORMAT
                    </h2>
                    <div className="space-y-2.5 pt-2">
                      {types.map((t) => {
                        const Icon = t.icon;
                        const isSelected = selectedType === t.id;
                        return (
                          <button
                            key={t.id}
                            onClick={() => setSelectedType(t.id)}
                            className={`w-full p-4 border text-left flex items-start gap-4 transition-all ${
                              isSelected
                                ? 'bg-[#151515] border-[#D4AF37]'
                                : 'bg-[#111111] border-[#252525] hover:border-[#D4AF37]/50'
                            }`}
                          >
                            <div
                              className={`p-2.5 rounded-xs ${
                                isSelected ? 'bg-[#D4AF37] text-black' : 'bg-[#1a1a1a] text-[#A3A3A3]'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="text-xs font-bold uppercase tracking-wider text-white">
                                {t.title}
                              </div>
                              <div className="text-[11px] text-[#888888] font-light mt-0.5">
                                {t.desc}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 2: Upload Artwork / Photo */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono uppercase text-[#D4AF37] tracking-widest">
                      STEP 2 OF 6
                    </span>
                    <h2 className="text-xl font-bold uppercase tracking-tight text-white font-sans">
                      UPLOAD REFERENCE ARTWORK / PHOTO
                    </h2>
                    <p className="text-xs text-[#888888] font-light">
                      Upload an image you like. In the next step, you can explain what changes you would like us to make.
                    </p>

                    <div className="pt-2">
                      <label className="border-2 border-dashed border-[#252525] hover:border-[#D4AF37]/50 bg-[#111111] p-8 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
                        <Upload className="w-8 h-8 text-[#D4AF37] mb-3" />
                        <span className="text-xs font-bold uppercase tracking-wider text-white mb-1">
                          CLICK TO UPLOAD REFERENCE IMAGE
                        </span>
                        <span className="text-[11px] text-[#666666] font-mono">
                          PNG, JPG, SVG, WEBP up to 15MB
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="pt-4">
                      <span className="text-[11px] font-mono text-[#666666] uppercase tracking-wider block mb-2">
                        OR CHOOSE A STUDIO PRESET REFERENCE
                      </span>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=400&q=80',
                          'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=400&q=80',
                          'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80',
                          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80'
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            onClick={() => setUploadedImage(preset)}
                            className={`aspect-square overflow-hidden border ${
                              uploadedImage === preset ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50' : 'border-[#252525] opacity-60'
                            }`}
                          >
                            <img src={preset} alt="preset" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Custom Text & Adjustments */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono uppercase text-[#D4AF37] tracking-widest">
                      STEP 3 OF 6
                    </span>
                    <h2 className="text-xl font-bold uppercase tracking-tight text-white font-sans">
                      DESIGN IDEA & REQUIRED CHANGES
                    </h2>

                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="text-xs font-mono uppercase text-[#A3A3A3] block mb-1.5">
                          TATTOO CONCEPT / TITLE
                        </label>
                        <input
                          type="text"
                          value={tattooIdea}
                          onChange={(e) => setTattooIdea(e.target.value)}
                          placeholder="e.g. Japanese Dragon with Crescent Moon, Cyber Sigil, Botanical Snake"
                          className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] px-4 py-3 text-sm text-white placeholder-[#666666] focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-mono uppercase text-[#A3A3A3] block mb-1.5">
                          CHANGES FROM REFERENCE IMAGE ("I WANT SOMETHING SIMILAR BUT...")
                        </label>
                        <textarea
                          rows={3}
                          value={requiredChanges}
                          onChange={(e) => setRequiredChanges(e.target.value)}
                          placeholder="Describe changes: e.g. Make shading darker, remove flowers, adapt for inner forearm, add custom initials..."
                          className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] p-3 text-xs text-white placeholder-[#666666] focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-mono uppercase text-[#A3A3A3] block mb-1.5">
                          CUSTOM WORDS, NUMBERS OR COORDINATES (OPTIONAL)
                        </label>
                        <input
                          type="text"
                          value={customText}
                          onChange={(e) => setCustomText(e.target.value)}
                          placeholder="e.g. Memento Vivere, 1999, NYC 40.7128° N"
                          className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] px-4 py-3 text-sm text-white placeholder-[#666666] focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-mono uppercase text-[#A3A3A3] block mb-1.5">
                          TYPOGRAPHY STYLE
                        </label>
                        <div className="space-y-2">
                          {fonts.map((f) => (
                            <button
                              key={f.id}
                              onClick={() => setSelectedFont(f.id)}
                              className={`w-full p-3 text-left border flex items-center justify-between text-xs transition-colors ${
                                selectedFont === f.id
                                  ? 'bg-[#151515] border-[#D4AF37] text-[#D4AF37] font-bold'
                                  : 'bg-[#111111] border-[#252525] text-[#888888] hover:text-[#D4AF37]'
                              }`}
                            >
                              <span className={f.style}>{f.id}</span>
                              {selectedFont === f.id && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Body Placement */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono uppercase text-[#D4AF37] tracking-widest">
                      STEP 4 OF 6
                    </span>
                    <h2 className="text-xl font-bold uppercase tracking-tight text-white font-sans">
                      SELECT BODY PLACEMENT
                    </h2>
                    <div className="space-y-2 pt-2">
                      {placements.map((plc) => (
                        <button
                          key={plc.id}
                          onClick={() => setSelectedPlacement(plc.id)}
                          className={`w-full p-3.5 border flex items-center justify-between transition-all ${
                            selectedPlacement === plc.id
                              ? 'bg-[#151515] border-[#D4AF37] text-[#D4AF37]'
                              : 'bg-[#111111] border-[#252525] text-[#888888] hover:text-[#D4AF37]'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold uppercase tracking-wider">{plc.name}</div>
                            <div className="text-[10px] font-mono text-[#666666]">
                              Typical Duration: {plc.duration}
                            </div>
                          </div>
                          {selectedPlacement === plc.id && <Check className="w-4 h-4 text-[#D4AF37]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 5: Size Selection */}
                {currentStep === 5 && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono uppercase text-[#D4AF37] tracking-widest">
                      STEP 5 OF 6
                    </span>
                    <h2 className="text-xl font-bold uppercase tracking-tight text-white font-sans">
                      SELECT TATTOO DIMENSIONS
                    </h2>
                    <div className="space-y-3 pt-2">
                      {sizes.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setSelectedSize(s.id as any)}
                          className={`w-full p-4 border text-left flex items-start justify-between transition-all ${
                            selectedSize === s.id
                              ? 'bg-[#151515] border-[#D4AF37] text-white'
                              : 'bg-[#111111] border-[#252525] text-[#888888] hover:text-white'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-white">
                                {s.label}
                              </span>
                              <span className="text-[11px] font-mono text-[#D4AF37]">
                                {s.priceAdd}
                              </span>
                            </div>
                            <div className="text-xs font-mono text-[#A3A3A3] mt-0.5">
                              {s.dimensions}
                            </div>
                            <div className="text-[11px] text-[#666666] mt-1 font-light">{s.desc}</div>
                          </div>
                          {selectedSize === s.id && <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 6: Customer Details & Quote Request */}
                {currentStep === 6 && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono uppercase text-[#D4AF37] tracking-widest">
                      STEP 6 OF 6
                    </span>
                    <h2 className="text-xl font-bold uppercase tracking-tight text-white font-sans">
                      CUSTOMER CONTACT & QUOTE SPECIFICATION
                    </h2>

                    <div className="space-y-3 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
                            YOUR FULL NAME *
                          </label>
                          <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="e.g. John Doe"
                            className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] p-2.5 text-xs text-white placeholder-[#666666] focus:outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
                            PHONE / WHATSAPP *
                          </label>
                          <input
                            type="tel"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] p-2.5 text-xs text-white placeholder-[#666666] focus:outline-none"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
                          EMAIL ADDRESS (FOR STUDIO QUOTE NOTIFICATION) *
                        </label>
                        <input
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="your.email@domain.com"
                          className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] p-2.5 text-xs text-white placeholder-[#666666] focus:outline-none"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
                            PREFERRED SESSION / CONSULTATION DATE
                          </label>
                          <input
                            type="date"
                            value={preferredDate}
                            onChange={(e) => setPreferredDate(e.target.value)}
                            className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] p-2.5 text-xs text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
                            ESTIMATED BUDGET (OPTIONAL)
                          </label>
                          <input
                            type="text"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            placeholder="e.g. ₹2,000 - ₹4,000"
                            className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] p-2.5 text-xs text-white placeholder-[#666666] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
                          ADDITIONAL NOTES FOR STUDIO ARTISTS
                        </label>
                        <textarea
                          rows={2}
                          value={specialNotes}
                          onChange={(e) => setSpecialNotes(e.target.value)}
                          placeholder="Any specific linework thickness, shading style, or skin sensitivity notes..."
                          className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] p-2.5 text-xs text-white placeholder-[#666666] focus:outline-none"
                        />
                      </div>

                      <div className="p-3 bg-[#111111] border border-[#252525] space-y-1 text-[11px] font-mono">
                        <div className="text-[#D4AF37] uppercase text-[10px]">REQUEST RECAP</div>
                        <div className="flex justify-between text-white">
                          <span className="text-[#888888]">Idea:</span>
                          <span className="font-bold text-[#D4AF37]">{tattooIdea || 'Custom Reference'}</span>
                        </div>
                        <div className="flex justify-between text-white">
                          <span className="text-[#888888]">Placement & Size:</span>
                          <span>{selectedPlacement} • {selectedSize}</span>
                        </div>
                        {requiredChanges && (
                          <div className="text-[#888888] pt-1">
                            <span className="text-white">Changes:</span> "{requiredChanges}"
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Stepper Navigation Buttons */}
                <div className="pt-6 border-t border-[#252525] flex items-center justify-between gap-4 mt-6">
                  {currentStep > 1 ? (
                    <button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="px-4 py-3 bg-[#111111] border border-[#252525] hover:border-[#D4AF37]/50 text-xs font-mono uppercase text-white hover:text-[#D4AF37] flex items-center gap-2 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>PREVIOUS</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 6 ? (
                    <button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="px-6 py-3 bg-[#8B0000] text-white hover:bg-[#A30000] text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors shadow-lg shadow-[#8B0000]/20"
                    >
                      <span>CONTINUE</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleFinalSubmit}
                      disabled={isSubmitting}
                      className="px-6 sm:px-8 py-3.5 bg-[#8B0000] text-white hover:bg-[#A30000] text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors shadow-xl shadow-[#8B0000]/30 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'PROCESSING...' : 'SUBMIT FOR STUDIO QUOTE'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Right Live Simulation Preview Card (5 Cols) */}
              <div className="lg:col-span-5 bg-[#0E0E0E] border border-[#252525] p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center pb-3 border-b border-[#252525]">
                    <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest">
                      REFERENCE PREVIEW
                    </span>
                    <span className="text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-2 py-0.5">
                      BESPOKE STENCIL
                    </span>
                  </div>

                  {/* Body & Ink Composite Canvas */}
                  <div className="relative aspect-[3/4] bg-black my-4 border border-[#252525] overflow-hidden flex items-center justify-center tattoo-preview-bg">
                    {/* Background Body Surface */}
                    <img
                      src="https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=800&q=80"
                      alt="Skin background"
                      className="w-full h-full object-cover filter contrast-125 brightness-[0.7]"
                    />

                    {/* Simulated Ink Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      {uploadedImage && (
                        <img
                          src={uploadedImage}
                          alt="Custom design"
                          className={`max-w-[70%] max-h-[60%] object-contain filter contrast-200 invert mix-blend-screen opacity-90 transition-all ${
                            selectedSize === 'Large'
                              ? 'scale-125'
                              : selectedSize === 'Small'
                              ? 'scale-75'
                              : 'scale-100'
                          }`}
                        />
                      )}

                      {customText && (
                        <div className="mt-3 text-[#D4AF37] text-base sm:text-lg font-bold uppercase tracking-widest font-mono drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                          {customText}
                        </div>
                      )}

                      <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono text-[#D4AF37] border border-[#D4AF37]/40">
                        PLACEMENT: {selectedPlacement.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Cost Breakdown / Studio Note */}
                <div className="pt-4 border-t border-[#252525] space-y-2">
                  <div className="text-xs font-mono space-y-1">
                    <div className="flex justify-between text-[#888888]">
                      <span>BASE FORMULATION</span>
                      <span>₹{basePrice}</span>
                    </div>
                    {typeCost > 0 && (
                      <div className="flex justify-between text-[#888888]">
                        <span>ARTWORK STENCIL RENDERING</span>
                        <span>+₹{typeCost}</span>
                      </div>
                    )}
                    {sizeCost > 0 && (
                      <div className="flex justify-between text-[#888888]">
                        <span>{selectedSize.toUpperCase()} TEMPLATE SURCHARGE</span>
                        <span>+₹{sizeCost}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#252525] flex justify-between items-baseline">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-white block">
                        ESTIMATED BASE
                      </span>
                      <span className="text-[10px] font-mono text-[#666666]">
                        * Final price quoted by studio admin
                      </span>
                    </div>
                    <span className="text-xl font-black font-mono text-[#D4AF37]">
                      ₹{totalPrice}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
