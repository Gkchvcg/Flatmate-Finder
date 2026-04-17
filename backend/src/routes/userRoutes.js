import express from 'express';
const router = express.Router();
import { getMe, updateMe } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

export default router;
