import { store } from '../services/dataStore.js';

export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await store.getCoupons();
    res.json({
      success: true,
      count: coupons.length,
      coupons
    });
  } catch (error) {
    next(error);
  }
};

export const validateCoupon = async (req, res, next) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    const coupon = await store.getCouponByCode(code);
    if (!coupon || !coupon.active) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
    }

    const total = Number(cartTotal) || 0;
    if (total < coupon.minimumOrder) {
      return res.status(400).json({
        success: false,
        message: `This coupon requires a minimum cart value of ₹${coupon.minimumOrder}`
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'Percentage') {
      discountAmount = Math.round((total * coupon.discountValue) / 100);
      if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
        discountAmount = coupon.maximumDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    res.json({
      success: true,
      message: 'Coupon applied successfully',
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (req, res, next) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minimumOrder,
      maximumDiscount,
      expiryDate,
      usageLimit
    } = req.body;

    if (!code || !discountValue) {
      return res.status(400).json({ success: false, message: 'Coupon code and discount value are required' });
    }

    const existing = await store.getCouponByCode(code);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    }

    const coupon = await store.createCoupon({
      code: code.toUpperCase(),
      discountType: discountType || 'Percentage',
      discountValue: Number(discountValue),
      minimumOrder: minimumOrder ? Number(minimumOrder) : 0,
      maximumDiscount: maximumDiscount ? Number(maximumDiscount) : 500,
      expiryDate: expiryDate ? new Date(expiryDate) : new Date(Date.now() + 90 * 86400000),
      usageLimit: usageLimit ? Number(usageLimit) : 1000,
      active: true
    });

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      coupon
    });
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.code) updates.code = updates.code.toUpperCase();

    const updated = await store.updateCoupon(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    res.json({
      success: true,
      message: 'Coupon updated successfully',
      coupon: updated
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await store.deleteCoupon(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    res.json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
