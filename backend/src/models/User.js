import mongoose from 'mongoose';

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
    interests: {
      type: [String],
      default: [],
    },
    hobbies: {
      type: [String],
      default: [],
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
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    sleepSchedule: {
      type: String,
      enum: ['Early Bird', 'Night Owl', 'Flexible'],
    },
    smokingHabit: {
      type: Boolean,
      default: false,
    },
    drinkingHabit: {
      type: Boolean,
      default: false,
    },
    cleanlinessLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
    },
    preferredArea: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);
