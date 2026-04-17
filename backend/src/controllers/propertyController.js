import Property from '../models/Property.js';

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
      .populate('creator', 'name email phone interests hobbies')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Property.countDocuments(query);

    res.status(200).json({
      properties,
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
    const property = await Property.findById(req.params.id).populate('creator', 'name email phone interests hobbies');
    if (!property) {
      res.status(404);
      throw new Error('Property not found');
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
      preferredGender, preferredSleepSchedule, smokingAllowed, drinkingAllowed, preferredCleanliness
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
      preferredCleanliness
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
