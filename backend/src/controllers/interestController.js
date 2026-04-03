const Interest = require('../models/Interest');
const Property = require('../models/Property');

// @desc    Show interest in a property
// @route   POST /api/interests
// @access  Private
const createInterest = async (req, res, next) => {
  try {
    const { propertyId } = req.body;

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
            propertyId
        });
        res.status(201).json(interest);
    } catch(err) {
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
const getMyInterests = async (req, res, next) => {
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
const getReceivedInterests = async (req, res, next) => {
  try {
    // 1. Find all properties created by current user
    const myProperties = await Property.find({ creator: req.user.id }).select('_id');
    const propertyIds = myProperties.map(p => p._id);

    // 2. Find all interests linked to those properties
    const interests = await Interest.find({ propertyId: { $in: propertyIds } })
        .populate('userId', 'name email phone')
        .populate('propertyId', 'title city rent');
        
    res.status(200).json(interests);
  } catch (error) {
    next(error);
  }
};

// @desc    Update interest status (Accept/Reject)
// @route   PUT /api/interests/:id
// @access  Private
const updateInterestStatus = async (req, res, next) => {
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

        interest.status = status;
        const updatedInterest = await interest.save();
        res.status(200).json(updatedInterest);

    } catch (error) {
        next(error);
    }
}

module.exports = {
  createInterest,
  getMyInterests,
  getReceivedInterests,
  updateInterestStatus
};
