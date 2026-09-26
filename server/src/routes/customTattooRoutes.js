import express from 'express';
import {
  createCustomTattoo,
  getMyCustomTattoos,
  getCustomTattoos,
  getCustomTattooById,
  updateCustomTattoo,
  confirmCustomTattoo
} from '../controllers/customTattooController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
}, createCustomTattoo);

router.get('/my-requests', protect, getMyCustomTattoos);
router.post('/:id/confirm', confirmCustomTattoo);
router.get('/:id', getCustomTattooById);

// Admin-only endpoints
router.get('/', protect, requireAdmin, getCustomTattoos);
router.put('/:id', protect, requireAdmin, updateCustomTattoo);

export default router;
