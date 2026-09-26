import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  comparePrice: {
    type: Number,
    min: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['men', 'women', 'unisex', 'Men', 'Women', 'Unisex'],
    default: 'Unisex'
  },
  placement: [{
    type: String
  }],
  sizes: [{
    type: String,
    enum: ['Small', 'Medium', 'Large', 'S', 'M', 'L']
  }],
  tags: [{
    type: String
  }],
  stock: {
    type: Number,
    required: true,
    default: 50
  },
  sku: {
    type: String,
    sparse: true
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  trending: {
    type: Boolean,
    default: false
  },
  newArrival: {
    type: Boolean,
    default: false
  },
  bestSeller: {
    type: Boolean,
    default: false
  },
  available: {
    type: Boolean,
    default: true
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);
