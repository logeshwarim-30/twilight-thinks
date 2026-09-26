import express from 'express';
import {
  getAnalytics,
  getCustomers,
  getInventory,
  updateInventoryStock
} from '../controllers/adminController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, requireAdmin);

router.get('/analytics', getAnalytics);
router.get('/customers', getCustomers);
router.get('/inventory', getInventory);
router.put('/inventory/:id', updateInventoryStock);

export default router;
