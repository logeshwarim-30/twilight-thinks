import express from 'express';
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getReviews);
router.post('/', (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
}, createReview);

// Admin-only endpoints
router.put('/:id', protect, requireAdmin, updateReview);
router.delete('/:id', protect, requireAdmin, deleteReview);

export default router;
