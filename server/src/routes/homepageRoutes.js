import express from 'express';
import {
  getHomepageSections,
  updateHomepageSection
} from '../controllers/homepageController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getHomepageSections);
router.put('/:key', protect, requireAdmin, updateHomepageSection);

export default router;
