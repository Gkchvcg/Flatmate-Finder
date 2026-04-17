import { Router } from 'express';
const router = Router();
import { createInterest, getUserInterests, getReceivedInterests, updateInterestStatus } from '../controllers/interestController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/', protect, createInterest);
router.get('/me', protect, getUserInterests);
router.get('/received', protect, getReceivedInterests);
router.put('/:id', protect, updateInterestStatus);

export default router;
