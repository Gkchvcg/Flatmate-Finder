import express from 'express';
import { generatePropertyDescription, getChatIcebreakers, getCompatibilityScore, generateUserBio, suggestListingImprovements } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/property-description', protect, generatePropertyDescription);
router.get('/icebreakers', protect, getChatIcebreakers);
router.get('/compatibility', protect, getCompatibilityScore);
router.post('/user-bio', protect, generateUserBio);
router.post('/listing-review', protect, suggestListingImprovements);

export default router;
