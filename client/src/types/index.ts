export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  discount?: number;
  images: string[];
  category: string;
  gender: string;
  placement: string[];
  sizes: ('Small' | 'Medium' | 'Large' | string)[];
  tags: string[];
  stock: number;
  sku?: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  trending: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  available?: boolean;
  isPublished?: boolean;
  createdAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  status: 'active' | 'inactive';
  featured?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
  isCustom?: boolean;
  customDetails?: {
    type?: string;
    style?: string;
    tattooIdea?: string;
    requiredChanges?: string;
    customText?: string;
    font?: string;
    placement?: string;
    size?: string;
    artworkUrl?: string;
  };
}

export interface UserAddress {
  _id?: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  addresses?: UserAddress[];
  wishlist?: string[];
  createdAt?: string;
}

export interface OrderItem {
  product?: string;
  name: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
  isCustom?: boolean;
  customDetails?: any;
}

export interface OrderTimeline {
  status: string;
  timestamp: string;
  note: string;
}

export interface Order {
  _id: string;
  orderId: string;
  user?: string | null;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
  };
  orderType?: 'Studio Appointment Booking' | 'Studio Tattoo Order' | 'Delivery' | string;
  bookingDate?: string;
  bookingTime?: string;
  deliveryMethod: 'Standard' | 'Express' | 'Studio Pick-up / Appointment' | string;
  shippingCost: number;
  discountAmount: number;
  couponApplied?: string;
  subtotal: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'In Progress' | 'Completed' | 'Cancelled' | 'Refunded';
  timeline: OrderTimeline[];
  createdAt: string;
}

export interface CustomTattooRequest {
  _id: string;
  requestId: string;
  user?: string | null;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  type: string;
  style?: string;
  tattooIdea?: string;
  customText?: string;
  font?: string;
  description?: string;
  requiredChanges?: string;
  placement: string;
  size: 'Small' | 'Medium' | 'Large' | string;
  artworkUrl?: string;
  budget?: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
  price: number;
  quotedPrice?: number;
  isCustomerConfirmed?: boolean;
  customerConfirmationDate?: string;
  status:
    | 'Pending'
    | 'New'
    | 'Reviewing'
    | 'Price Quoted'
    | 'Customer Confirmation Pending'
    | 'Confirmed'
    | 'In Progress'
    | 'Designing'
    | 'Awaiting Approval'
    | 'Approved'
    | 'Production'
    | 'Completed'
    | 'Rejected'
    | 'Cancelled';
  internalNotes?: string;
  createdAt: string;
}

export interface StudioSettings {
  _id?: string;
  studioName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  address: string;
  hours?: string;
  openingHours?: string;
  announcementBanner?: string;
  currency?: string;
  currencySymbol?: string;
  consultationFee?: number;
  minimumCustomPrice?: number;
  depositPercentage?: number;
}

export interface Review {
  _id: string;
  userName: string;
  productName: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedBuyer: boolean;
  status: 'Approved' | 'Pending' | 'Hidden';
  createdAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  discountType: 'Percentage' | 'Flat Discount' | 'Buy X Get Y';
  discountValue: number;
  minimumOrder: number;
  maximumDiscount?: number;
  expiryDate?: string;
  usageLimit?: number;
  usageCount?: number;
  active: boolean;
}

export interface HomepageSection {
  _id: string;
  key: string;
  title: string;
  subtitle: string;
  badge?: string;
  content: any;
  isActive: boolean;
  order: number;
}
