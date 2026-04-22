import express from 'express';
import { generateMessage } from '../services/generative.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/generative/chat
router.post('/chat', protect, async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: 'Prompt required' });
    const output = await generateMessage(prompt);
    res.json({ output });
  } catch (err) {
    next(err);
  }
});

export default router;
