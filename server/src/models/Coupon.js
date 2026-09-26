import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  discountType: {
    type: String,
    enum: ['Percentage', 'Flat Discount', 'Buy X Get Y'],
    default: 'Percentage'
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  minimumOrder: {
    type: Number,
    default: 0
  },
  maximumDiscount: {
    type: Number,
    default: 500
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    default: () => new Date(+new Date() + 90 * 24 * 60 * 60 * 1000)
  },
  usageLimit: {
    type: Number,
    default: 1000
  },
  usageCount: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
