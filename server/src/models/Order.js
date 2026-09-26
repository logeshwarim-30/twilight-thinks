import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  size: { type: String, default: 'Medium' },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  isCustom: { type: Boolean, default: false },
  customDetails: {
    type: { type: String },
    customText: { type: String },
    placement: { type: String },
    artworkUrl: { type: String }
  }
}, { _id: true });

const timelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, default: '' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  customerDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  items: [orderItemSchema],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  orderType: {
    type: String,
    enum: ['Studio Appointment Booking', 'Studio Tattoo Order', 'Delivery'],
    default: 'Studio Tattoo Order'
  },
  bookingDate: {
    type: String,
    default: ''
  },
  bookingTime: {
    type: String,
    default: ''
  },
  deliveryMethod: {
    type: String,
    enum: ['Standard', 'Express', 'Studio Pick-up / Appointment'],
    default: 'Standard'
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  couponApplied: {
    type: String,
    default: ''
  },
  subtotal: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['UPI', 'Card', 'Cash on Delivery', 'COD'],
    default: 'UPI'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  status: {
    type: String,
    enum: [
      'Pending',
      'Confirmed',
      'Processing',
      'Shipped',
      'Out for Delivery',
      'Delivered',
      'Cancelled',
      'Refunded'
    ],
    default: 'Confirmed'
  },
  timeline: [timelineSchema]
}, {
  timestamps: true
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
