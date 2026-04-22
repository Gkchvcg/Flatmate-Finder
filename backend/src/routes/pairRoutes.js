import express from 'express';
import pairController from '../controllers/pairController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, pairController.createPair);
router.post('/:id/review', protect, pairController.addReview);
// Get all pairs for the logged-in user
router.get('/user', protect, pairController.getUserPairs);

export default router;
