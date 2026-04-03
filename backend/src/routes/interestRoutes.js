const express = require('express');
const router = express.Router();
const {
  createInterest,
  getMyInterests,
  getReceivedInterests,
  updateInterestStatus
} = require('../controllers/interestController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createInterest);
router.get('/me', protect, getMyInterests);
router.get('/received', protect, getReceivedInterests);
router.put('/:id', protect, updateInterestStatus);

module.exports = router;
