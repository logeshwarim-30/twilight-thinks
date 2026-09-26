import bcrypt from 'bcryptjs';

// High-definition curated photography of black tattoos, dark aesthetics & editorial fashion
export const categoriesData = [
  {
    name: 'Men',
    slug: 'men',
    description: 'Bold lines, dark mythological beasts, and geometric chest & arm pieces.',
    image: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    featured: true
  },
  {
    name: 'Women',
    slug: 'women',
    description: 'Delicate botanicals, celestial phases, and sensual fine-line silhouettes.',
    image: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    featured: true
  },
  {
    name: 'Anime',
    slug: 'anime',
    description: 'Iconic dark shonen cursed marks, demon eyes, and cyberpunk manga ink.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    featured: true
  },
  {
    name: 'Minimal',
    slug: 'minimal',
    description: 'Single-needle micro designs, clean typography, and subtle coordinates.',
    image: 'https://images.unsplash.com/photo-1560707303-4e980ce876ad?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    featured: true
  },
  {
    name: 'Dark',
    slug: 'dark',
    description: 'Occult symbolism, gothic sigils, fallen wings, and raven talons.',
    image: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    featured: true
  },
  {
    name: 'Japanese',
    slug: 'japanese',
    description: 'Irezumi dragons, raging Oni masks, cherry blossoms, and samurai katanas.',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    featured: true
  },
  {
    name: 'Spiritual',
    slug: 'spiritual',
    description: 'Sacred geometry, unalomes, third eyes, mandalas, and chakras.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    featured: false
  },
  {
    name: 'Nature',
    slug: 'nature',
    description: 'Midnight flora, predatory serpents, wild wolves, and moon-lit ravens.',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    featured: false
  },
  {
    name: 'Couple',
    slug: 'couple',
    description: 'Interlocking geometric oaths, dual moons, and complementary soul marks.',
    image: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    featured: false
  },
  {
    name: 'Cyberpunk',
    slug: 'cyberpunk',
    description: 'Subdermal circuit boards, biometric barcodes, and dystopian neural prints.',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    featured: false
  }
];

export const productsData = [
  {
    name: 'Midnight Serpent',
    slug: 'midnight-serpent',
    description: 'An intricately coiled viper rendered in hyper-fine stipple shading. Represents eternal rebirth, nocturnal intuition, and quiet lethal grace. Formulated with 100% plant-based Genipa Americana fruit juice for an authentic deep midnight matte finish lasting 10 to 15 days.',
    price: 399,
    comparePrice: 599,
    discount: 33,
    images: [
      'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Dark',
    gender: 'Unisex',
    placement: ['Arm', 'Wrist', 'Neck'],
    sizes: ['Small', 'Medium', 'Large'],
    tags: ['serpent', 'dark', 'snake', 'bestseller', 'minimal'],
    stock: 85,
    sku: 'TT-PRD-001',
    rating: 4.9,
    reviewCount: 124,
    featured: true,
    trending: true,
    newArrival: false,
    bestSeller: true
  },
  {
    name: 'Shadow Raven',
    slug: 'shadow-raven',
    description: 'A harbinger of mystery and arcane wisdom. Features expansive flight feathers and intricate plumage texture that sinks deep into the epidermal surface. Waterproof, sweat-proof, and designed to look indistinguishable from fresh needlework.',
    price: 449,
    comparePrice: 649,
    discount: 30,
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Dark',
    gender: 'Unisex',
    placement: ['Shoulder', 'Chest', 'Back'],
    sizes: ['Medium', 'Large'],
    tags: ['raven', 'gothic', 'bird', 'dark'],
    stock: 42,
    sku: 'TT-PRD-002',
    rating: 4.8,
    reviewCount: 98,
    featured: true,
    trending: true,
    newArrival: false,
    bestSeller: true
  },
  {
    name: 'Lunar Wolf',
    slug: 'lunar-wolf',
    description: 'A stylized predator howling into crescent phases of the moon. Blends Norse mythology with clean editorial linework. Perfectly suited for forearm and calf placements.',
    price: 499,
    comparePrice: 699,
    discount: 28,
    images: [
      'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Men',
    gender: 'Men',
    placement: ['Arm', 'Chest', 'Back'],
    sizes: ['Medium', 'Large'],
    tags: ['wolf', 'moon', 'nature', 'mythology'],
    stock: 35,
    sku: 'TT-PRD-003',
    rating: 4.9,
    reviewCount: 110,
    featured: true,
    trending: true,
    newArrival: false,
    bestSeller: true
  },
  {
    name: 'Broken Halo',
    slug: 'broken-halo',
    description: 'An ethereal splintered aureole floating above shattered thorns. A provocative study on duality, perfection, and rebellious self-expression. Razor-sharp fine lines that develop gradually over 24-36 hours.',
    price: 349,
    comparePrice: 499,
    discount: 30,
    images: [
      'https://images.unsplash.com/photo-1560707303-4e980ce876ad?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Minimal',
    gender: 'Unisex',
    placement: ['Neck', 'Wrist', 'Finger'],
    sizes: ['Small', 'Medium'],
    tags: ['halo', 'minimal', 'angelic', 'edgy'],
    stock: 92,
    sku: 'TT-PRD-004',
    rating: 4.7,
    reviewCount: 76,
    featured: false,
    trending: true,
    newArrival: true,
    bestSeller: false
  },
  {
    name: 'Silent Blade',
    slug: 'silent-blade',
    description: 'A dagger piercing a bruised peony, surrounded by descending droplets of ink. Embodying courage, loyalty, and calculated intent. High contrast black ink that responds naturally to your skin pH.',
    price: 399,
    comparePrice: 549,
    discount: 27,
    images: [
      'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Dark',
    gender: 'Unisex',
    placement: ['Arm', 'Ankle', 'Wrist'],
    sizes: ['Small', 'Medium', 'Large'],
    tags: ['dagger', 'blade', 'flower', 'dark'],
    stock: 64,
    sku: 'TT-PRD-005',
    rating: 4.8,
    reviewCount: 88,
    featured: true,
    trending: false,
    newArrival: true,
    bestSeller: false
  },
  {
    name: 'Japanese Oni',
    slug: 'japanese-oni',
    description: 'Fierce traditional Japanese demon mask with curved horns, exposed fangs, and flowing tempest clouds. Authentic Irezumi aesthetic scaled for dramatic modern fashion statements.',
    price: 549,
    comparePrice: 799,
    discount: 31,
    images: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Japanese',
    gender: 'Men',
    placement: ['Arm', 'Chest', 'Back'],
    sizes: ['Medium', 'Large'],
    tags: ['japanese', 'oni', 'demon', 'mask', 'irezumi'],
    stock: 28,
    sku: 'TT-PRD-006',
    rating: 5.0,
    reviewCount: 145,
    featured: true,
    trending: true,
    newArrival: false,
    bestSeller: true
  },
  {
    name: 'Dark Phoenix',
    slug: 'dark-phoenix',
    description: 'Immortal firebird bursting from obsidian ashes with sweeping wing feathers and smoke trails. Dramatic movement engineered for shoulder or back contouring.',
    price: 529,
    comparePrice: 749,
    discount: 29,
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Dark',
    gender: 'Unisex',
    placement: ['Back', 'Shoulder', 'Chest'],
    sizes: ['Large'],
    tags: ['phoenix', 'fire', 'rebirth', 'large'],
    stock: 19,
    sku: 'TT-PRD-007',
    rating: 4.9,
    reviewCount: 64,
    featured: true,
    trending: false,
    newArrival: false,
    bestSeller: false
  },
  {
    name: 'Celestial Eye',
    slug: 'celestial-eye',
    description: 'The all-seeing eye of Horus nested within geometric planetary orbits and celestial coordinates. A talisman of hyper-perception and cosmic balance.',
    price: 369,
    comparePrice: 499,
    discount: 26,
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560707303-4e980ce876ad?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Spiritual',
    gender: 'Unisex',
    placement: ['Wrist', 'Neck', 'Arm'],
    sizes: ['Small', 'Medium'],
    tags: ['celestial', 'eye', 'geometry', 'spiritual'],
    stock: 73,
    sku: 'TT-PRD-008',
    rating: 4.8,
    reviewCount: 92,
    featured: false,
    trending: true,
    newArrival: true,
    bestSeller: false
  },
  {
    name: 'Wild Rose',
    slug: 'wild-rose',
    description: 'Botanical perfection featuring thorned stems, unfurling dark petals, and realistic micro-shading. Elegant and rebellious all at once.',
    price: 349,
    comparePrice: 499,
    discount: 30,
    images: [
      'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560707303-4e980ce876ad?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Women',
    gender: 'Women',
    placement: ['Wrist', 'Arm', 'Ankle', 'Neck'],
    sizes: ['Small', 'Medium'],
    tags: ['rose', 'floral', 'botanical', 'fine-line'],
    stock: 88,
    sku: 'TT-PRD-009',
    rating: 4.9,
    reviewCount: 156,
    featured: true,
    trending: true,
    newArrival: false,
    bestSeller: true
  },
  {
    name: 'Black Moth',
    slug: 'black-moth',
    description: 'Deaths-head hawkmoth with skull insignia on thorax and ornate symmetrical wings. A classic dark aesthetic symbol of transformation and night flights.',
    price: 429,
    comparePrice: 599,
    discount: 28,
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Dark',
    gender: 'Unisex',
    placement: ['Chest', 'Arm', 'Neck'],
    sizes: ['Medium', 'Large'],
    tags: ['moth', 'skull', 'goth', 'symmetry'],
    stock: 50,
    sku: 'TT-PRD-010',
    rating: 4.8,
    reviewCount: 103,
    featured: true,
    trending: true,
    newArrival: false,
    bestSeller: true
  },
  {
    name: 'Eternal Flame',
    slug: 'eternal-flame',
    description: 'Stylized neo-tribal flame contours dancing in fluid black symmetry. Dynamic Gen-Z editorial piece made for fingers, wrist, or collarbone.',
    price: 299,
    comparePrice: 420,
    discount: 28,
    images: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560707303-4e980ce876ad?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Minimal',
    gender: 'Unisex',
    placement: ['Finger', 'Wrist', 'Neck'],
    sizes: ['Small', 'Medium'],
    tags: ['flame', 'tribal', 'y2k', 'minimal'],
    stock: 120,
    sku: 'TT-PRD-011',
    rating: 4.7,
    reviewCount: 82,
    featured: false,
    trending: true,
    newArrival: true,
    bestSeller: false
  },
  {
    name: 'Shadow Dragon',
    slug: 'shadow-dragon',
    description: 'Eastern coiled celestial dragon with scaly serpentine body, razor claws, and whisker ribbons. Dramatic full forearm piece.',
    price: 549,
    comparePrice: 799,
    discount: 31,
    images: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Japanese',
    gender: 'Men',
    placement: ['Arm', 'Back', 'Chest'],
    sizes: ['Large'],
    tags: ['dragon', 'japanese', 'mythical', 'sleeve'],
    stock: 22,
    sku: 'TT-PRD-012',
    rating: 4.9,
    reviewCount: 138,
    featured: true,
    trending: true,
    newArrival: false,
    bestSeller: true
  },
  {
    name: 'Minimal Snake',
    slug: 'minimal-snake',
    description: 'Crisp single continuous line silhouette of a graceful serpent. Understated, hypnotic, and exceptionally clean on the fingers or collarbone.',
    price: 279,
    comparePrice: 399,
    discount: 30,
    images: [
      'https://images.unsplash.com/photo-1560707303-4e980ce876ad?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Minimal',
    gender: 'Women',
    placement: ['Finger', 'Wrist', 'Ankle'],
    sizes: ['Small'],
    tags: ['snake', 'single-line', 'minimal', 'finger-tattoo'],
    stock: 150,
    sku: 'TT-PRD-013',
    rating: 4.8,
    reviewCount: 94,
    featured: false,
    trending: true,
    newArrival: false,
    bestSeller: true
  },
  {
    name: 'Moon Phase',
    slug: 'moon-phase',
    description: 'The seven lunar transitions aligned linearly from new moon to full moon. A tribute to cyclical transformation and nocturnal stillness.',
    price: 389,
    comparePrice: 499,
    discount: 22,
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Women',
    gender: 'Women',
    placement: ['Arm', 'Back', 'Chest'],
    sizes: ['Medium', 'Large'],
    tags: ['lunar', 'moon', 'phases', 'celestial'],
    stock: 67,
    sku: 'TT-PRD-014',
    rating: 4.9,
    reviewCount: 167,
    featured: true,
    trending: true,
    newArrival: false,
    bestSeller: true
  },
  {
    name: 'Fallen Angel',
    slug: 'fallen-angel',
    description: 'Black feather wings cast in dramatic sorrowful descent with weeping statuesque silhouette. Renaissance chiaroscuro rendered in tattoo ink.',
    price: 499,
    comparePrice: 699,
    discount: 28,
    images: [
      'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Dark',
    gender: 'Unisex',
    placement: ['Back', 'Chest', 'Shoulder'],
    sizes: ['Medium', 'Large'],
    tags: ['angel', 'wings', 'fallen', 'gothic'],
    stock: 31,
    sku: 'TT-PRD-015',
    rating: 4.8,
    reviewCount: 84,
    featured: false,
    trending: true,
    newArrival: true,
    bestSeller: false
  },
  {
    name: 'Sacred Geometry',
    slug: 'sacred-geometry',
    description: 'Metatrons cube interlocked with golden ratio spirals and isometric dimensional vertices. Precision line stability guaranteed.',
    price: 449,
    comparePrice: 599,
    discount: 25,
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560707303-4e980ce876ad?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Spiritual',
    gender: 'Unisex',
    placement: ['Arm', 'Chest', 'Back'],
    sizes: ['Medium', 'Large'],
    tags: ['geometry', 'sacred', 'metatron', 'lines'],
    stock: 46,
    sku: 'TT-PRD-016',
    rating: 4.7,
    reviewCount: 61,
    featured: false,
    trending: false,
    newArrival: true,
    bestSeller: false
  },
  {
    name: 'Samurai Spirit',
    slug: 'samurai-spirit',
    description: 'Weathered Kabuto helmet and crossed katana swords enclosed by stylized cherry blossom crest. The way of Bushido written in ink.',
    price: 519,
    comparePrice: 749,
    discount: 30,
    images: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Japanese',
    gender: 'Men',
    placement: ['Arm', 'Back'],
    sizes: ['Large'],
    tags: ['samurai', 'katana', 'warrior', 'japanese'],
    stock: 26,
    sku: 'TT-PRD-017',
    rating: 5.0,
    reviewCount: 112,
    featured: true,
    trending: true,
    newArrival: false,
    bestSeller: true
  },
  {
    name: 'Thunder Mark',
    slug: 'thunder-mark',
    description: 'Fractal lightning bolt splitting through runic Norse sigils. Sharp angles and sudden raw energy capturing nature pure fury.',
    price: 329,
    comparePrice: 450,
    discount: 26,
    images: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560707303-4e980ce876ad?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Men',
    gender: 'Men',
    placement: ['Wrist', 'Neck', 'Arm'],
    sizes: ['Small', 'Medium'],
    tags: ['thunder', 'lightning', 'energy', 'minimal'],
    stock: 80,
    sku: 'TT-PRD-018',
    rating: 4.6,
    reviewCount: 54,
    featured: false,
    trending: false,
    newArrival: true,
    bestSeller: false
  },
  {
    name: 'Lost Soul',
    slug: 'lost-soul',
    description: 'A shadowy cloaked wanderer holding an arcane lantern amidst creeping fog. Melancholic, cinematic, and profoundly introspective.',
    price: 439,
    comparePrice: 599,
    discount: 26,
    images: [
      'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Dark',
    gender: 'Unisex',
    placement: ['Arm', 'Shoulder'],
    sizes: ['Medium', 'Large'],
    tags: ['lantern', 'dark', 'fog', 'wanderer'],
    stock: 39,
    sku: 'TT-PRD-019',
    rating: 4.8,
    reviewCount: 77,
    featured: false,
    trending: true,
    newArrival: true,
    bestSeller: false
  },
  {
    name: 'Cosmic Eye',
    slug: 'cosmic-eye',
    description: 'An open iris containing swirling star clusters, nebula gas rings, and gravitational waves. Intricate stipple shading that deepens like a midnight sky.',
    price: 379,
    comparePrice: 499,
    discount: 24,
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Spiritual',
    gender: 'Unisex',
    placement: ['Arm', 'Wrist', 'Neck'],
    sizes: ['Small', 'Medium'],
    tags: ['cosmic', 'eye', 'space', 'galaxy'],
    stock: 58,
    sku: 'TT-PRD-020',
    rating: 4.9,
    reviewCount: 95,
    featured: false,
    trending: false,
    newArrival: true,
    bestSeller: false
  },
  {
    name: 'Dark Butterfly',
    slug: 'dark-butterfly',
    description: 'Fine-needle gothic butterfly with razor-laced wing borders and bleeding ink textures. Gen-Z high-fashion street staple.',
    price: 339,
    comparePrice: 480,
    discount: 29,
    images: [
      'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560707303-4e980ce876ad?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Women',
    gender: 'Women',
    placement: ['Wrist', 'Neck', 'Ankle', 'Chest'],
    sizes: ['Small', 'Medium'],
    tags: ['butterfly', 'goth', 'delicate', 'fashion'],
    stock: 110,
    sku: 'TT-PRD-021',
    rating: 4.9,
    reviewCount: 172,
    featured: true,
    trending: true,
    newArrival: false,
    bestSeller: true
  },
  {
    name: 'Silent Warrior',
    slug: 'silent-warrior',
    description: 'Blindfolded spartan guardian leaning upon an obsidian broadsword. Minimalist brushwork conveying stoic resolve and quiet power.',
    price: 479,
    comparePrice: 650,
    discount: 26,
    images: [
      'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Men',
    gender: 'Men',
    placement: ['Arm', 'Chest', 'Back'],
    sizes: ['Medium', 'Large'],
    tags: ['warrior', 'sword', 'stoic', 'men'],
    stock: 45,
    sku: 'TT-PRD-022',
    rating: 4.8,
    reviewCount: 89,
    featured: false,
    trending: false,
    newArrival: false,
    bestSeller: false
  },
  {
    name: 'Black Lotus',
    slug: 'black-lotus',
    description: 'Sacred water lily blossoming out of dark murky depths into unblemished clarity. Balanced petals, delicate pistil dots, and fine-line geometry.',
    price: 359,
    comparePrice: 499,
    discount: 28,
    images: [
      'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Women',
    gender: 'Women',
    placement: ['Wrist', 'Back', 'Neck'],
    sizes: ['Small', 'Medium'],
    tags: ['lotus', 'spiritual', 'bloom', 'clean'],
    stock: 95,
    sku: 'TT-PRD-023',
    rating: 4.9,
    reviewCount: 133,
    featured: false,
    trending: true,
    newArrival: false,
    bestSeller: true
  },
  {
    name: 'Night Rider',
    slug: 'night-rider',
    description: 'Grim skeletal renegade astride a roaring café racer framed by retro 80s dystopian gridlines. Edgy, rebellious, and unapologetic.',
    price: 499,
    comparePrice: 699,
    discount: 28,
    images: [
      'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Men',
    gender: 'Men',
    placement: ['Arm', 'Back'],
    sizes: ['Large'],
    tags: ['motorcycle', 'skull', 'rider', 'rebel'],
    stock: 33,
    sku: 'TT-PRD-024',
    rating: 4.8,
    reviewCount: 71,
    featured: false,
    trending: false,
    newArrival: true,
    bestSeller: false
  },
  {
    name: 'Ancient Symbol',
    slug: 'ancient-symbol',
    description: 'Alchemical glyph of mercury and salt surrounded by forgotten primordial runes. Minimalist esoteric mark for the subtle initiate.',
    price: 299,
    comparePrice: 399,
    discount: 25,
    images: [
      'https://images.unsplash.com/photo-1560707303-4e980ce876ad?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Minimal',
    gender: 'Unisex',
    placement: ['Finger', 'Wrist', 'Neck'],
    sizes: ['Small'],
    tags: ['rune', 'alchemy', 'ancient', 'minimal'],
    stock: 140,
    sku: 'TT-PRD-025',
    rating: 4.7,
    reviewCount: 68,
    featured: false,
    trending: false,
    newArrival: false,
    bestSeller: false
  },
  {
    name: 'Crimson Heart',
    slug: 'crimson-heart',
    description: 'Anatomical cardiovascular organ wound with barbed wire and weeping black botanical vines. Dark romanticism for genuine passion.',
    price: 419,
    comparePrice: 580,
    discount: 27,
    images: [
      'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Dark',
    gender: 'Unisex',
    placement: ['Chest', 'Arm'],
    sizes: ['Small', 'Medium'],
    tags: ['heart', 'barbed-wire', 'romantic', 'dark'],
    stock: 52,
    sku: 'TT-PRD-026',
    rating: 4.8,
    reviewCount: 81,
    featured: false,
    trending: true,
    newArrival: false,
    bestSeller: false
  },
  {
    name: 'Ghost Flower',
    slug: 'ghost-flower',
    description: 'Translucent monotropa uniflora bleeding into monochromatic smoke rings. Mysterious, ethereal, and subtle in daylight.',
    price: 369,
    comparePrice: 499,
    discount: 26,
    images: [
      'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Nature',
    gender: 'Women',
    placement: ['Arm', 'Wrist', 'Ankle'],
    sizes: ['Small', 'Medium'],
    tags: ['flower', 'ghost', 'smoke', 'nature'],
    stock: 63,
    sku: 'TT-PRD-027',
    rating: 4.9,
    reviewCount: 89,
    featured: false,
    trending: false,
    newArrival: true,
    bestSeller: false
  },
  {
    name: 'Urban Skull',
    slug: 'urban-skull',
    description: 'Cybernetic cranium etched with streetwear graffiti tags and barbed wire sutures. A striking testament to concrete jungle grit.',
    price: 469,
    comparePrice: 650,
    discount: 27,
    images: [
      'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Dark',
    gender: 'Men',
    placement: ['Arm', 'Shoulder', 'Chest'],
    sizes: ['Medium', 'Large'],
    tags: ['skull', 'urban', 'streetwear', 'dark'],
    stock: 44,
    sku: 'TT-PRD-028',
    rating: 4.8,
    reviewCount: 96,
    featured: false,
    trending: true,
    newArrival: false,
    bestSeller: false
  },
  {
    name: 'Eclipse',
    slug: 'eclipse',
    description: 'Black solar disc surrounded by shimmering coronal light rays and descending lunar shadow geometry. Understated elegance.',
    price: 349,
    comparePrice: 480,
    discount: 27,
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560707303-4e980ce876ad?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Minimal',
    gender: 'Unisex',
    placement: ['Wrist', 'Neck', 'Finger'],
    sizes: ['Small', 'Medium'],
    tags: ['eclipse', 'sun', 'moon', 'minimal'],
    stock: 87,
    sku: 'TT-PRD-029',
    rating: 4.9,
    reviewCount: 114,
    featured: true,
    trending: true,
    newArrival: false,
    bestSeller: true
  },
  {
    name: 'Wanderer',
    slug: 'wanderer',
    description: 'Vintage brass nautical compass encircled by jagged alpine mountain peaks and pine silhouettes. For those driven by wanderlust.',
    price: 429,
    comparePrice: 599,
    discount: 28,
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Nature',
    gender: 'Unisex',
    placement: ['Arm', 'Back'],
    sizes: ['Medium', 'Large'],
    tags: ['compass', 'mountains', 'wanderer', 'travel'],
    stock: 55,
    sku: 'TT-PRD-030',
    rating: 4.8,
    reviewCount: 101,
    featured: false,
    trending: false,
    newArrival: false,
    bestSeller: true
  }
];

export const reviewsData = [
  {
    userName: 'Aarav Mehta',
    productName: 'Midnight Serpent',
    rating: 5,
    title: 'Indistinguishable from a real needle tattoo',
    comment: 'Applied it to my forearm before Goa trip. Was dark navy on day 1, then turned deep jet black by hour 36. Swam in the ocean for 4 days straight and it stayed intact. Everyone asked which studio I went to.',
    isVerifiedBuyer: true,
    status: 'Approved'
  },
  {
    userName: 'Kavya Singhania',
    productName: 'Dark Butterfly',
    rating: 5,
    title: 'The linework is breathtakingly sharp',
    comment: 'The fine-needle details are so crisp! The formula is completely painless and feels just like soft skin. Lasted a solid 14 days before starting to fade evenly.',
    isVerifiedBuyer: true,
    status: 'Approved'
  },
  {
    userName: 'Rohan Sen',
    productName: 'Japanese Oni',
    rating: 5,
    title: 'Worth every rupee',
    comment: 'The demon horns and cloud patterns are insane. Used it for our music video shoot and it stole the show. Easy to apply with the wet towel method.',
    isVerifiedBuyer: true,
    status: 'Approved'
  },
  {
    userName: 'Ananya Sharma',
    productName: 'Wild Rose',
    rating: 5,
    title: 'Minimalist & sensual',
    comment: 'Placed this along my collarbone. It looks like an authentic stick-and-poke art piece from Berlin. 10/10 recommend TWILIGHT THINKS.',
    isVerifiedBuyer: true,
    status: 'Approved'
  },
  {
    userName: 'Devansh Verma',
    productName: 'Lunar Wolf',
    rating: 5,
    title: 'Lasted full 12 days through gym sweat',
    comment: 'Was skeptical about sweat resistance, but cardio and daily showers did nothing to it. Deep matte finish, no shiny sticker plastic film look at all.',
    isVerifiedBuyer: true,
    status: 'Approved'
  },
  {
    userName: 'Sanya Kapoor',
    productName: 'Moon Phase',
    rating: 5,
    title: 'Obsessed with the gradient development',
    comment: 'Watching the formula react with my skin amino acids over 24 hours was so cool. The packaging was luxury editorial black box. Will buy again!',
    isVerifiedBuyer: true,
    status: 'Approved'
  },
  {
    userName: 'Vikram Joshi',
    productName: 'Samurai Spirit',
    rating: 5,
    title: 'Pure Japanese art on skin',
    comment: 'Extremely detailed katana blades. Got endless compliments at the gallery opening. TWILIGHT THINKS is redefining body art.',
    isVerifiedBuyer: true,
    status: 'Approved'
  },
  {
    userName: 'Priya Nambiar',
    productName: 'Black Lotus',
    rating: 5,
    title: 'Gentle on sensitive skin',
    comment: 'I usually break out with chemical henna or temporary tattoos, but this plant-based Jagua formula had zero irritation. Clean, organic, gorgeous.',
    isVerifiedBuyer: true,
    status: 'Approved'
  },
  {
    userName: 'Ishaan Roy',
    productName: 'Shadow Raven',
    rating: 5,
    title: 'Gothic masterpiece',
    comment: 'The wing shading has real depth. It is not flat black; it looks like textured ink washed with carbon shading. Pure class.',
    isVerifiedBuyer: true,
    status: 'Approved'
  },
  {
    userName: 'Meera Deshmukh',
    productName: 'Broken Halo',
    rating: 5,
    title: 'Subtle yet provocative',
    comment: 'Put it behind my ear and it gives off such an edgy high-fashion vibe. Application took 30 seconds.',
    isVerifiedBuyer: true,
    status: 'Approved'
  }
];

export const couponsData = [
  {
    code: 'TWILIGHT10',
    discountType: 'Percentage',
    discountValue: 10,
    minimumOrder: 499,
    maximumDiscount: 200,
    active: true,
    usageLimit: 5000,
    usageCount: 230
  },
  {
    code: 'INKED20',
    discountType: 'Percentage',
    discountValue: 20,
    minimumOrder: 999,
    maximumDiscount: 400,
    active: true,
    usageLimit: 1000,
    usageCount: 145
  },
  {
    code: 'FIRSTDROP',
    discountType: 'Flat Discount',
    discountValue: 100,
    minimumOrder: 599,
    maximumDiscount: 100,
    active: true,
    usageLimit: 3000,
    usageCount: 412
  },
  {
    code: 'DARKVIP',
    discountType: 'Percentage',
    discountValue: 25,
    minimumOrder: 1499,
    maximumDiscount: 600,
    active: true,
    usageLimit: 500,
    usageCount: 88
  },
  {
    code: 'FREESHIP',
    discountType: 'Flat Discount',
    discountValue: 50,
    minimumOrder: 399,
    maximumDiscount: 50,
    active: true,
    usageLimit: 10000,
    usageCount: 890
  }
];

export const customTattoosData = [
  {
    requestId: 'CT-2026-1001',
    customer: {
      name: 'Rohan Mehra',
      email: 'rohan.m@example.com',
      phone: '+91 98765 43210'
    },
    type: 'Custom Artwork',
    customText: 'Solitude in Motion',
    font: 'Gothic Serif',
    placement: 'Arm',
    size: 'Large',
    artworkUrl: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=600&q=80',
    notes: 'Please keep the stippling very fine around the raven feathers.',
    price: 649,
    status: 'In Production',
    internalNotes: 'Vector art approved by lead artist. Shipped to printer unit.'
  },
  {
    requestId: 'CT-2026-1002',
    customer: {
      name: 'Tara Mukherjee',
      email: 'tara.m@example.com',
      phone: '+91 98220 11445'
    },
    type: 'Text',
    customText: 'Memento Vivere',
    font: 'Minimalist Sans',
    placement: 'Wrist',
    size: 'Small',
    artworkUrl: '',
    notes: 'Clean typewriter kerning with subtle spacing.',
    price: 399,
    status: 'Approved',
    internalNotes: 'Proof sent to Tara. Awaiting queue release.'
  },
  {
    requestId: 'CT-2026-1003',
    customer: {
      name: 'Arjun Das',
      email: 'arjun.d@example.com',
      phone: '+91 99100 88223'
    },
    type: 'Photo',
    customText: '',
    font: '',
    placement: 'Chest',
    size: 'Medium',
    artworkUrl: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=600&q=80',
    notes: 'Convert photo of my vintage bike crest into high contrast stencil.',
    price: 549,
    status: 'Designing',
    internalNotes: 'Stencil conversion underway in Studio B.'
  },
  {
    requestId: 'CT-2026-1004',
    customer: {
      name: 'Zara Khan',
      email: 'zara.k@example.com',
      phone: '+91 97654 32190'
    },
    type: 'Symbol',
    customText: '1998 // Infinite',
    font: 'Chicano Script',
    placement: 'Neck',
    size: 'Small',
    artworkUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    notes: 'Place the infinity knot right between the roman numerals.',
    price: 449,
    status: 'New',
    internalNotes: 'New submission received today.'
  },
  {
    requestId: 'CT-2026-1005',
    customer: {
      name: 'Karan Singhal',
      email: 'karan.s@example.com',
      phone: '+91 98334 55122'
    },
    type: 'Custom Artwork',
    customText: 'Cyber Ronin',
    font: 'Japanese Katakana',
    placement: 'Back',
    size: 'Large',
    artworkUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    notes: 'Needs to span 18cm across shoulder blades.',
    price: 649,
    status: 'Reviewing',
    internalNotes: 'Checking resolution suitability for large template.'
  }
];

export const demoOrdersData = [
  {
    orderId: 'TT-2026-9001',
    customerDetails: {
      name: 'Aarav Mehta',
      email: 'aarav.m@example.com',
      phone: '+91 98765 11223'
    },
    items: [
      {
        name: 'Midnight Serpent',
        image: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=400&q=80',
        size: 'Medium',
        quantity: 2,
        price: 399
      },
      {
        name: 'Broken Halo',
        image: 'https://images.unsplash.com/photo-1560707303-4e980ce876ad?auto=format&fit=crop&w=400&q=80',
        size: 'Small',
        quantity: 1,
        price: 349
      }
    ],
    shippingAddress: {
      street: '402, Highline Residency, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      country: 'India'
    },
    deliveryMethod: 'Express',
    shippingCost: 0,
    discountAmount: 100,
    couponApplied: 'FIRSTDROP',
    subtotal: 1147,
    totalAmount: 1047,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'Delivered',
    timeline: [
      { status: 'Confirmed', timestamp: new Date(Date.now() - 5 * 86400000), note: 'Order placed & UPI verified' },
      { status: 'Processing', timestamp: new Date(Date.now() - 4 * 86400000), note: 'Packed at Dark Studio Mumbai' },
      { status: 'Shipped', timestamp: new Date(Date.now() - 3 * 86400000), note: 'Dispatched via Bluedart AWB#998231' },
      { status: 'Delivered', timestamp: new Date(Date.now() - 1 * 86400000), note: 'Delivered to recipient' }
    ]
  },
  {
    orderId: 'TT-2026-9002',
    customerDetails: {
      name: 'Kavya Singhania',
      email: 'kavya.s@example.com',
      phone: '+91 98112 33445'
    },
    items: [
      {
        name: 'Japanese Oni',
        image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80',
        size: 'Large',
        quantity: 1,
        price: 549
      }
    ],
    shippingAddress: {
      street: 'Flat 12B, Regency Heights, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      country: 'India'
    },
    deliveryMethod: 'Standard',
    shippingCost: 0,
    discountAmount: 0,
    couponApplied: '',
    subtotal: 549,
    totalAmount: 549,
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    status: 'Shipped',
    timeline: [
      { status: 'Confirmed', timestamp: new Date(Date.now() - 2 * 86400000), note: 'Order placed and paid' },
      { status: 'Processing', timestamp: new Date(Date.now() - 1 * 86400000), note: 'Sealed with application kit' },
      { status: 'Shipped', timestamp: new Date(), note: 'In transit via Delhivery' }
    ]
  },
  {
    orderId: 'TT-2026-9003',
    customerDetails: {
      name: 'Siddharth Rao',
      email: 'siddharth.r@example.com',
      phone: '+91 99001 22334'
    },
    items: [
      {
        name: 'Shadow Raven',
        image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80',
        size: 'Large',
        quantity: 1,
        price: 449
      },
      {
        name: 'Custom Tattoo — Solitude in Motion',
        image: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=400&q=80',
        size: 'Large',
        quantity: 1,
        price: 649,
        isCustom: true
      }
    ],
    shippingAddress: {
      street: 'House 88, Vasant Vihar',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110057',
      country: 'India'
    },
    deliveryMethod: 'Express',
    shippingCost: 50,
    discountAmount: 109,
    couponApplied: 'TWILIGHT10',
    subtotal: 1098,
    totalAmount: 1039,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'Processing',
    timeline: [
      { status: 'Confirmed', timestamp: new Date(Date.now() - 1 * 86400000), note: 'Order accepted' },
      { status: 'Processing', timestamp: new Date(), note: 'Custom stencil printing underway' }
    ]
  },
  {
    orderId: 'TT-2026-9004',
    customerDetails: {
      name: 'Pooja Iyer',
      email: 'pooja.i@example.com',
      phone: '+91 97766 55443'
    },
    items: [
      {
        name: 'Dark Butterfly',
        image: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=400&q=80',
        size: 'Small',
        quantity: 2,
        price: 339
      }
    ],
    shippingAddress: {
      street: 'Plot 45, Jubilee Hills Road No 36',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
      country: 'India'
    },
    deliveryMethod: 'Standard',
    shippingCost: 0,
    discountAmount: 0,
    couponApplied: '',
    subtotal: 678,
    totalAmount: 678,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending',
    status: 'Confirmed',
    timeline: [
      { status: 'Confirmed', timestamp: new Date(), note: 'COD order confirmed with customer' }
    ]
  },
  {
    orderId: 'TT-2026-9005',
    customerDetails: {
      name: 'Aditya Chawla',
      email: 'aditya.c@example.com',
      phone: '+91 98881 22339'
    },
    items: [
      {
        name: 'Lunar Wolf',
        image: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=400&q=80',
        size: 'Medium',
        quantity: 1,
        price: 499
      },
      {
        name: 'Wild Rose',
        image: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=400&q=80',
        size: 'Small',
        quantity: 1,
        price: 349
      }
    ],
    shippingAddress: {
      street: 'Sector 15, House 312',
      city: 'Chandigarh',
      state: 'Punjab',
      pincode: '160015',
      country: 'India'
    },
    deliveryMethod: 'Standard',
    shippingCost: 0,
    discountAmount: 0,
    couponApplied: '',
    subtotal: 848,
    totalAmount: 848,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'Out for Delivery',
    timeline: [
      { status: 'Confirmed', timestamp: new Date(Date.now() - 3 * 86400000), note: 'Order accepted' },
      { status: 'Processing', timestamp: new Date(Date.now() - 2 * 86400000), note: 'Packed' },
      { status: 'Shipped', timestamp: new Date(Date.now() - 1 * 86400000), note: 'Arrived at Chandigarh hub' },
      { status: 'Out for Delivery', timestamp: new Date(), note: 'Courier executive assigned' }
    ]
  }
];

export const homepageCmsData = [
  {
    key: 'hero',
    title: 'TWILIGHT THINKS',
    subtitle: 'Semi-permanent tattoos designed for personal style, self-expression and experimentation.',
    badge: 'NEW GENERATION PLANT-BASED INK',
    content: {
      primaryCta: 'SHOP TATTOOS',
      primaryCtaLink: '/shop',
      secondaryCta: 'CREATE YOUR OWN',
      secondaryCtaLink: '/custom-tattoo',
      headlinePrefix: 'INK WITHOUT',
      headlineEmphasis: 'REGRET.',
      heroImage: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1600&q=85',
      durationTag: '1–2 WEEKS LASTING',
      waterproofTag: '100% WATERPROOF',
      organicTag: 'ORGANIC JAGUA FORMULA'
    },
    isActive: true,
    order: 1
  },
  {
    key: 'categories',
    title: 'SHOP BY CATEGORY',
    subtitle: 'Explore curated dark aesthetics across aesthetic genres.',
    badge: 'COLLECTIONS',
    content: {
      displayLimit: 6
    },
    isActive: true,
    order: 2
  },
  {
    key: 'trending',
    title: 'TRENDING NOW',
    subtitle: 'The most coveted ink silhouettes moving across our dark community.',
    badge: 'HOTTEST DROPS',
    content: {
      displayLimit: 4
    },
    isActive: true,
    order: 3
  },
  {
    key: 'newArrivals',
    title: 'NEW ARRIVALS',
    subtitle: 'Freshly synthesized botanical designs straight from our dark studio.',
    badge: 'JUST RELEASED',
    content: {
      displayLimit: 8
    },
    isActive: true,
    order: 4
  },
  {
    key: 'customTattoo',
    title: 'CREATE YOUR OWN TATTOO',
    subtitle: 'Turn your idea, memory, name, photo or artwork into a personalized semi-permanent tattoo.',
    badge: 'STUDIO BESPOKE',
    content: {
      ctaText: 'START CUSTOMIZING NOW',
      startingPrice: 'Starts at ₹399',
      image: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=1200&q=80'
    },
    isActive: true,
    order: 5
  },
  {
    key: 'featured',
    title: 'FEATURED EDITORIAL',
    subtitle: 'Dark aesthetics meeting Gen-Z fashion and self-expression.',
    badge: 'VOL. 04 LOOKBOOK',
    content: {
      editorialTitle: 'THE MIDNIGHT CANVAS',
      editorialText: 'We believe identity is fluid. TWILIGHT THINKS gives you the luxury of needlework without the lifelong permanence. Made with organic Genipa fruit juice, our ink sinks into your skin first layer and develops with your body natural chemistry.',
      image1: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=800&q=80',
      image2: 'https://images.unsplash.com/photo-1560707303-4e980ce876ad?auto=format&fit=crop&w=800&q=80'
    },
    isActive: true,
    order: 6
  },
  {
    key: 'whyUs',
    title: 'WHY TWILIGHT THINKS',
    subtitle: 'Engineered for skin perfection, painless application, and zero regrets.',
    badge: 'THE FORMULA',
    content: {
      items: [
        {
          title: '1-2 WEEKS DURATION',
          description: 'Sinks into the epidermis and fades naturally with your skin cell turnover.'
        },
        {
          title: '100% WATERPROOF',
          description: 'Survives pool swims, intense gym sessions, and daily hot showers without peeling.'
        },
        {
          title: 'PLANT-BASED & SKIN SAFE',
          description: 'Crafted from organic South American Jagua fruit. Dermatologically certified, non-toxic, and vegan.'
        },
        {
          title: 'ZERO NEEDLES, ZERO REGRETS',
          description: 'Applies in 60 seconds with simple water pressure. Develops into jet matte black within 24-36 hours.'
        }
      ]
    },
    isActive: true,
    order: 7
  },
  {
    key: 'reviews',
    title: 'COMMUNITY VOICES',
    subtitle: 'Real stories from over 45,000+ satisfied ink wearers.',
    badge: 'VERIFIED REVIEWS',
    content: {},
    isActive: true,
    order: 8
  },
  {
    key: 'newsletter',
    title: 'JOIN THE TWILIGHT LIST',
    subtitle: 'Receive private drops, secret flash sales, and new aesthetic collections directly in your inbox.',
    badge: 'INNER CIRCLE',
    content: {
      placeholder: 'Enter your email address',
      buttonText: 'UNLOCK VIP ACCESS',
      perk: 'Get 10% off your first drop with code FIRSTDROP'
    },
    isActive: true,
    order: 9
  }
];
