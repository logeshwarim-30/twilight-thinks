import express from 'express';
import {
  getCoupons,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon
} from '../controllers/couponController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/validate', validateCoupon);

// Admin-only endpoints
router.get('/', protect, requireAdmin, getCoupons);
router.post('/', protect, requireAdmin, createCoupon);
router.put('/:id', protect, requireAdmin, updateCoupon);
router.delete('/:id', protect, requireAdmin, deleteCoupon);

export default router;
