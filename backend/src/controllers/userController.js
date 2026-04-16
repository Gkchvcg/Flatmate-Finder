const User = require('../models/User');

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile & preferences
// @route   PUT /api/users/me
// @access  Private
const updateMe = async (req, res, next) => {
  try {
    const { name, phone, preferences, interests, hobbies } = req.body;
    
    // Only allow updating specific fields
    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (preferences) updateFields.preferences = preferences;
    if (interests) updateFields.interests = interests;
    if (hobbies) updateFields.hobbies = hobbies;

    const user = await User.findByIdAndUpdate(req.user.id, updateFields, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMe,
  updateMe,
};
