import Pair from '../models/Pair.js';

// @desc Create pair from confirmed interest
// @route POST /api/pairs
export const createPair = async (req, res, next) => {
  try {
    const { interestId } = req.body;
    const interest = await Interest.findById(interestId).populate('userId propertyId creator');
    
    if (!interest || interest.status !== 'InterestedUserConfirmed') {
      return res.status(400).json({ message: 'Invalid interest for pairing' });
    }
    
    const pair = await Pair.create({
      user1: interest.userId._id,
      user2: interest.propertyId.creator,
      property: interest.propertyId._id
    });
    
    // Deactivate property
    await Property.findByIdAndUpdate(interest.propertyId._id, { active: false });
    
    // Update interest status
    interest.status = 'MutualConfirmed';
    await interest.save();
    
    res.status(201).json(pair);
  } catch (error) {
    next(error);
  }
};

// @desc Add review to pair
// @route POST /api/pairs/:id/review
export const addReview = async (req, res, next) => {
  try {
    const pair = await Pair.findById(req.params.id);
    if (!pair) {
      return res.status(404).json({ message: 'Pair not found' });
    }
    
    // Check if user is part of pair
    if (pair.user1.toString() !== req.user.id && pair.user2.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    pair.reviews.push({
      user: req.user.id,
      ...req.body
    });
    
    await pair.save();
    res.json(pair);
  } catch (error) {
    next(error);
  }
};

export default {
  createPair,
  addReview
};

