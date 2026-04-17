import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
export const getMe = async (req, res, next) => {
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
export const updateMe = async (req, res, next) => {
  try {
    const { name, phone, preferences, interests, hobbies, gender, sleepSchedule, smokingHabit, drinkingHabit, cleanlinessLevel, preferredArea, occupation } = req.body;

    // Only allow updating specific fields
    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (preferences) updateFields.preferences = preferences;
    if (interests) updateFields.interests = interests;
    if (hobbies) updateFields.hobbies = hobbies;
    if (gender) updateFields.gender = gender;
    if (sleepSchedule) updateFields.sleepSchedule = sleepSchedule;
    if (smokingHabit !== undefined) updateFields.smokingHabit = smokingHabit;
    if (drinkingHabit !== undefined) updateFields.drinkingHabit = drinkingHabit;
    if (cleanlinessLevel) updateFields.cleanlinessLevel = cleanlinessLevel;
    if (preferredArea) updateFields.preferredArea = preferredArea;
    if (occupation) updateFields.occupation = occupation;

    const user = await User.findByIdAndUpdate(req.user.id, updateFields, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Named exports used above
