import mongoose from 'mongoose';

const customTattooSchema = new mongoose.Schema({
  requestId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' }
  },
  type: {
    type: String,
    default: 'Custom Artwork'
  },
  style: {
    type: String,
    default: 'Custom Artwork'
  },
  tattooIdea: {
    type: String,
    default: ''
  },
  customText: {
    type: String,
    default: ''
  },
  font: {
    type: String,
    default: 'Gothic Serif'
  },
  description: {
    type: String,
    default: ''
  },
  requiredChanges: {
    type: String,
    default: ''
  },
  placement: {
    type: String,
    default: 'Arm'
  },
  size: {
    type: String,
    default: 'Medium'
  },
  artworkUrl: {
    type: String,
    default: ''
  },
  budget: {
    type: String,
    default: ''
  },
  preferredDate: {
    type: String,
    default: ''
  },
  preferredTime: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0
  },
  quotedPrice: {
    type: Number,
    default: 0
  },
  isCustomerConfirmed: {
    type: Boolean,
    default: false
  },
  customerConfirmationDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: [
      'Pending',
      'New',
      'Reviewing',
      'Price Quoted',
      'Customer Confirmation Pending',
      'Confirmed',
      'In Progress',
      'Designing',
      'Awaiting Approval',
      'Approved',
      'Production',
      'Completed',
      'Rejected',
      'Cancelled'
    ],
    default: 'Pending'
  },
  internalNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.models.CustomTattoo || mongoose.model('CustomTattoo', customTattooSchema);
