import Interest from '../models/Interest.js';
import Property from '../models/Property.js';
import User from '../models/User.js';
import { calculateCompatibility } from '../utils/compatibility.js';

// @desc    Show interest in a property
// @route   POST /api/interests
// @access  Private
export const createInterest = async (req, res, next) => {
  try {
    const { propertyId, message } = req.body;

    if (!propertyId) {
      res.status(400);
      throw new Error('Please provide propertyId');
    }

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      res.status(404);
      throw new Error('Property not found');
    }

    // Prevent owner from showing interest in their own property
    if (property.creator.toString() === req.user.id) {
      res.status(400);
      throw new Error('Cannot show interest in your own property');
    }

    // Attempt to create interest (duplicate handled by unique index in schema)
    try {
      const interest = await Interest.create({
        userId: req.user.id,
        propertyId,
        message
      });
      await Property.findByIdAndUpdate(propertyId, { $inc: { pendingInterestCount: 1 } });
      res.status(201).json(interest);
    } catch (err) {
      if (err.code === 11000) {
        res.status(400);
        throw new Error('Interest already expressed for this property');
      }
      throw err;
    }

  } catch (error) {
    next(error);
  }
};

// @desc    Get user's interests (properties they showed interest in)
// @route   GET /api/interests/me
// @access  Private
export const getUserInterests = async (req, res, next) => {
  try {
    const interests = await Interest.find({ userId: req.user.id }).populate('propertyId');
    res.status(200).json(interests);
  } catch (error) {
    next(error);
  }
};

// @desc    Get interests for my properties (people interested in what I posted)
// @route   GET /api/interests/received
// @access  Private
export const getReceivedInterests = async (req, res, next) => {
  try {
    // 1. Get full profile of the current user (the owner)
    const owner = await User.findById(req.user.id);

    // 2. Find all properties created by current user
    const myProperties = await Property.find({ creator: req.user.id });
    const propertyIds = myProperties.map(p => p._id);

    // 3. Find all interests linked to those properties
    // We need more fields from userId for compatibility check
    const interests = await Interest.find({ propertyId: { $in: propertyIds } })
      .populate('userId', 'name email phone interests hobbies preferences gender sleepSchedule smokingHabit drinkingHabit cleanlinessLevel preferredArea occupation')
      .populate('propertyId', 'title city area rent');
    // 4. Calculate compatibility score (checksum) for each interest
    const interestsWithScores = interests.map(interest => {
      const interestObj = interest.toObject();
      if (interest.userId && interest.propertyId) {
        interestObj.checksum = calculateCompatibility(interest.userId, owner, interest.propertyId);
      } else {
        interestObj.checksum = 0;
      }
      return interestObj;
    });

    res.status(200).json(interestsWithScores);
  } catch (error) {
    next(error);
  }
};

// @desc    Update interest status (Accept/Reject)
// @route   PUT /api/interests/:id
// @access  Private
export const updateInterestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const interest = await Interest.findById(req.params.id).populate('propertyId');

    if (!interest) {
      res.status(404);
      throw new Error('Interest not found');
    }

    // Verify the logged-in user is the owner of the property
    if (interest.propertyId.creator.toString() !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized to update this interest');
    }
    // Update the actual interest document
    interest.status = status;
    const updatedInterest = await interest.save();
    
    // Manage pending counts
    if (status === 'Accepted' || status === 'Rejected') {
      await Property.findByIdAndUpdate(interest.propertyId._id, { $inc: { pendingInterestCount: -1 } });
    }

    res.status(200).json(updatedInterest);
  } catch (error) {
    next(error);
  }
};

export const confirmInterest = async (req, res, next) => {
  try {
    const interest = await Interest.findById(req.params.id).populate('propertyId');
    if (!interest) {
      res.status(404);
      throw new Error('Interest not found');
    }
    if (interest.userId.toString() !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized');
    }
    if (interest.status !== 'Accepted') {
      res.status(400);
      throw new Error('Can only confirm accepted interests');
    }
    interest.status = 'InterestedUserConfirmed';
    await interest.save();
    res.status(200).json(interest);
  } catch (error) {
    next(error);
  }
};

export default {
  createInterest,
  getUserInterests,
  getReceivedInterests,
  updateInterestStatus,
  confirmInterest
};