import express from 'express';
import { getOrCreateChat, postMessage, markRead } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/chats/:pairId  - returns chat (and messages) for the pair
router.get('/:pairId', protect, getOrCreateChat);

// POST /api/chats/:pairId/messages - post message to chat
router.post('/:pairId/messages', protect, postMessage);

// POST /api/chats/:pairId/read - mark messages as read
router.post('/:pairId/read', protect, markRead);

export default router;
