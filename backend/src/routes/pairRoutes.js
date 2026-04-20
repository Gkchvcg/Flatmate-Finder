import express from 'express';
const router = express.Router();
import pairController from '../controllers/pairController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/', protect, pairController.createPair);
router.post('/:id/review', protect, pairController.addReview);

export default router;
