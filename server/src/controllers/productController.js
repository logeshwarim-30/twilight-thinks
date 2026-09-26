import { store } from '../services/dataStore.js';

export const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      gender,
      placement,
      size,
      minPrice,
      maxPrice,
      inStock,
      sort,
      search,
      featured,
      trending,
      newArrival,
      bestSeller,
      limit
    } = req.query;

    let products = await store.getProducts();

    // 1. Search Query
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // 2. Category Filter
    if (category && category !== 'All' && category.trim() !== '') {
      const catLower = category.trim().toLowerCase();
      products = products.filter(p => p.category.toLowerCase() === catLower);
    }

    // 3. Gender Filter
    if (gender && gender !== 'All') {
      const gLower = gender.toLowerCase();
      products = products.filter(p =>
        p.gender.toLowerCase() === gLower || p.gender.toLowerCase() === 'unisex'
      );
    }

    // 4. Placement Filter
    if (placement && placement !== 'All') {
      const pLower = placement.toLowerCase();
      products = products.filter(p =>
        p.placement && p.placement.some(pl => pl.toLowerCase() === pLower)
      );
    }

    // 5. Size Filter
    if (size && size !== 'All') {
      const sLower = size.toLowerCase();
      products = products.filter(p =>
        p.sizes && p.sizes.some(sz => sz.toLowerCase() === sLower)
      );
    }

    // 6. Price Range
    if (minPrice !== undefined && minPrice !== '') {
      products = products.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      products = products.filter(p => p.price <= Number(maxPrice));
    }

    // 7. Stock Filter
    if (inStock === 'true') {
      products = products.filter(p => p.stock > 0);
    } else if (inStock === 'false') {
      products = products.filter(p => p.stock <= 0);
    }

    // 8. Badges Filter
    if (featured === 'true') products = products.filter(p => p.featured);
    if (trending === 'true') products = products.filter(p => p.trending);
    if (newArrival === 'true') products = products.filter(p => p.newArrival);
    if (bestSeller === 'true') products = products.filter(p => p.bestSeller);

    // 9. Sorting
    if (sort) {
      switch (sort) {
        case 'price-asc':
        case 'Price: Low to High':
        case 'Price Low to High':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
        case 'Price: High to Low':
        case 'Price High to Low':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
        case 'Newest':
          products.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          break;
        case 'best-selling':
        case 'Best Selling':
          products.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0) || b.rating - a.rating);
          break;
        case 'rating':
          products.sort((a, b) => b.rating - a.rating);
          break;
        case 'featured':
        default:
          products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
      }
    }

    if (limit) {
      products = products.slice(0, Number(limit));
    }

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

export const getProductByIdOrSlug = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await store.getProductByIdOrSlug(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      comparePrice,
      images,
      category,
      gender,
      placement,
      sizes,
      tags,
      stock,
      sku,
      featured,
      trending,
      newArrival,
      bestSeller,
      available
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: 'Name, price, and category are required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const numPrice = Number(price);
    const numCompare = comparePrice ? Number(comparePrice) : numPrice;
    const discount = numCompare > numPrice
      ? Math.round(((numCompare - numPrice) / numCompare) * 100)
      : 0;

    // Normalize images: accept array of strings or objects with url
    const normalizedImages = Array.isArray(images)
      ? images.map(img => typeof img === 'string' ? img.trim() : (img?.url || '').trim()).filter(Boolean)
      : [];
    const finalImages = normalizedImages.length > 0
      ? normalizedImages
      : ['https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80'];

    const product = await store.createProduct({
      name,
      slug,
      description: description || '',
      price: numPrice,
      comparePrice: numCompare,
      discount,
      images: finalImages,
      category,
      gender: gender || 'Unisex',
      placement: placement || ['Arm'],
      sizes: sizes || ['Medium'],
      tags: tags || [],
      stock: stock !== undefined ? Number(stock) : 50,
      sku: sku || `TT-${Date.now().toString().slice(-6)}`,
      rating: 4.8,
      reviewCount: 0,
      featured: Boolean(featured),
      trending: Boolean(trending),
      newArrival: Boolean(newArrival),
      bestSeller: Boolean(bestSeller),
      available: available !== undefined ? Boolean(available) : true,
      isPublished: true
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.name && !updates.slug) {
      updates.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    // Dynamic discount recalculation
    if (updates.price !== undefined || updates.comparePrice !== undefined) {
      const existingProduct = await store.getProductByIdOrSlug(id);
      const curPrice = updates.price !== undefined ? Number(updates.price) : Number(existingProduct?.price || 0);
      const curCompare = updates.comparePrice !== undefined ? Number(updates.comparePrice) : Number(existingProduct?.comparePrice || curPrice);
      if (curCompare > curPrice) {
        updates.discount = Math.round(((curCompare - curPrice) / curCompare) * 100);
      } else {
        updates.discount = 0;
      }
    }

    // Normalize images if provided
    if (updates.images && Array.isArray(updates.images)) {
      updates.images = updates.images
        .map(img => typeof img === 'string' ? img.trim() : (img?.url || '').trim())
        .filter(Boolean);
      if (updates.images.length === 0) {
        updates.images = ['https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80'];
      }
    }

    const updated = await store.updateProduct(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updated
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await store.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
