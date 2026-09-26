import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  studioName: { type: String, default: 'TWILIGHT THINKS' },
  tagline: { type: String, default: 'Premium Tattoo Studio & Custom Body Art Atelier' },
  phone: { type: String, default: '+91 98765 43210' },
  whatsapp: { type: String, default: '+91 98765 43210' },
  email: { type: String, default: 'concierge@twilightthinks.com' },
  instagram: { type: String, default: 'https://instagram.com' },
  address: { type: String, default: 'Suite 402, Highline Atelier, Bandra West, Mumbai 400050' },
  hours: { type: String, default: 'Mon–Sat: 10:00 AM – 8:00 PM IST' },
  currency: { type: String, default: 'INR' },
  currencySymbol: { type: String, default: '₹' },
  consultationFee: { type: Number, default: 0 },
  minimumCustomPrice: { type: Number, default: 500 }
}, {
  timestamps: true
});

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
