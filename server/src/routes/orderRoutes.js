import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', (req, res, next) => {
  // Allow optional token for checkout
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
}, createOrder);

router.get('/my-orders', protect, getMyOrders);
router.get('/:id', getOrderById);

// Admin-only endpoints
router.get('/', protect, requireAdmin, getAllOrders);
router.put('/:id/status', protect, requireAdmin, updateOrderStatus);

export default router;
