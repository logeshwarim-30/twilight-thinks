/**
 * Central WhatsApp utility for TWILIGHT THINKS Tattoo Studio
 */

export const cleanPhoneNumber = (phone: string): string => {
  // Remove spaces, hyphens, plus signs, brackets
  return phone.replace(/[^0-9]/g, '');
};

export const getStudioWhatsAppNumber = (customPhone?: string): string => {
  // Fallback to official studio concierge number
  return cleanPhoneNumber(customPhone || '+91 98200 12345');
};

export const buildWhatsAppUrl = (phone: string, message: string): string => {
  const cleanPhone = cleanPhoneNumber(phone) || '919820012345';
  const encoded = encodeURIComponent(message.trim());
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
};

export const buildTattooEnquiryMessage = (tattoo: {
  name: string;
  price: number;
  category?: string;
  placement?: string[];
  slug?: string;
}): string => {
  return [
    `Hi TWILIGHT THINKS,`,
    ``,
    `I am interested in this tattoo:`,
    `Tattoo: ${tattoo.name}`,
    `Price: ₹${tattoo.price.toLocaleString('en-IN')}`,
    tattoo.category ? `Category: ${tattoo.category}` : '',
    ``,
    `I would like to know more about booking this tattoo at your studio.`
  ]
    .filter(Boolean)
    .join('\n');
};

export const buildCustomTattooMessage = (details: {
  idea?: string;
  changes?: string;
  placement?: string;
  size?: string;
  budget?: string;
  customerName?: string;
  artworkUrl?: string;
}): string => {
  const parts = [
    `Hi TWILIGHT THINKS,`,
    ``,
    `I would like to enquire about getting a custom tattoo:`,
    details.idea ? `Idea: ${details.idea}` : '',
    details.changes ? `Requested Changes: ${details.changes}` : '',
    details.placement ? `Placement: ${details.placement}` : '',
    details.size ? `Size: ${details.size}` : '',
    details.budget ? `Budget: ${details.budget}` : '',
    details.artworkUrl ? `Reference Image: ${details.artworkUrl}` : '',
    ``,
    `Please let me know about availability, consultation and pricing.`
  ];

  return parts.filter(Boolean).join('\n');
};
