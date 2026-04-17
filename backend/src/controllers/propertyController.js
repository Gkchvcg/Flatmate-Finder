import Property from '../models/Property.js';
import User from '../models/User.js';
import { calculateCompatibility } from '../utils/compatibility.js';

// @desc    Get all properties (with filtering & pagination)
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res, next) => {
  try {
    const { city, minRent, maxRent, amenities, page = 1, limit = 10 } = req.query;

    let query = {};
    query.active = true;

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    if (minRent || maxRent) {
      query.rent = {};
      if (minRent) query.rent.$gte = Number(minRent);
      if (maxRent) query.rent.$lte = Number(maxRent);
    }

    if (amenities) {
      const amenitiesList = amenities.split(',');
      query.amenities = { $all: amenitiesList };
    }

    const properties = await Property.find(query)
      .populate('creator', 'name email phone interests hobbies gender sleepSchedule smokingHabit drinkingHabit cleanlinessLevel preferredArea occupation')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Property.countDocuments(query);

    // Add compatibility matching scores if user is logged in
    let propertiesWithScores = properties;
    if (req.user) {
      // Get the full profile of the logged-in user to ensure we have all compatibility fields
      const currentUser = await User.findById(req.user.id);
      
      propertiesWithScores = properties.map(property => {
        const propertyObj = property.toObject();
        // Skip match calculation if user is viewing their own property
        if (property.creator._id.toString() === req.user.id) {
          propertyObj.matchScore = 100;
        } else {
          propertyObj.matchScore = calculateCompatibility(currentUser, property.creator, property);
        }
        return propertyObj;
      });
    }

    res.status(200).json({
      properties: propertiesWithScores,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
const getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate('creator', 'name email phone interests hobbies gender sleepSchedule smokingHabit drinkingHabit cleanlinessLevel preferredArea occupation');
    if (!property) {
      res.status(404);
      throw new Error('Property not found');
    }
    if (req.user) {
      const currentUser = await User.findById(req.user.id);
      const propertyObj = property.toObject();
      if (property.creator._id.toString() === req.user.id) {
        propertyObj.matchScore = 100;
      } else {
        propertyObj.matchScore = calculateCompatibility(currentUser, property.creator, property);
      }
      return res.status(200).json(propertyObj);
    }

    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private
const createProperty = async (req, res, next) => {
  try {
    const {
      title, description, city, area, rent, deposit, amenities, availabilityDate,
      preferredGender, preferredSleepSchedule, smokingAllowed, drinkingAllowed, preferredCleanliness, preferredOccupation, images
    } = req.body;

    if (!title || !description || !city || !rent) {
      res.status(400);
      throw new Error('Please add required fields: title, description, city, rent');
    }

    const property = await Property.create({
      creator: req.user.id,
      title,
      description,
      city,
      area,
      rent,
      deposit,
      amenities,
      availabilityDate,
      preferredGender,
      preferredSleepSchedule,
      smokingAllowed,
      drinkingAllowed,
      preferredCleanliness,
      preferredOccupation,
      images: images || [],
    });

    res.status(201).json(property);
  } catch (error) {
    next(error);
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private
const updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      res.status(404);
      throw new Error('Property not found');
    }

    // Check for user
    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }

    // Make sure the logged in user matches the property creator
    if (property.creator.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedProperty);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private
const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      res.status(404);
      throw new Error('Property not found');
    }

    // Check for user
    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }

    // Make sure the logged in user matches the property creator
    if (property.creator.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

export default {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
};
