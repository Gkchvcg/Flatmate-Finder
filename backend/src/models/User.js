const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    phone: {
      type: String,
    },
    preferences: {
      city: String,
      budget: Number,
      genderPreference: {
        type: String,
        enum: ['Male', 'Female', 'Any'],
        default: 'Any',
      },
      foodHabits: {
        type: String,
        enum: ['Veg', 'Non-Veg', 'Any'],
        default: 'Any',
      },
      smokingDrinking: {
        type: String,
        enum: ['Allowed', 'Not Allowed'],
        default: 'Not Allowed',
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
