import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  userName: {
    type: String,
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  productName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    default: ''
  },
  comment: {
    type: String,
    required: true
  },
  isVerifiedBuyer: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['Approved', 'Pending', 'Hidden'],
    default: 'Approved'
  }
}, {
  timestamps: true
});

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);
