import mongoose from 'mongoose';

const propertySchema = mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    city: {
      type: String,
      required: [true, 'Please add a city'],
      index: true,
    },
    area: {
      type: String,
    },
    rent: {
      type: Number,
      required: [true, 'Please add the rent amount'],
    },
    deposit: {
      type: Number,
      default: 0,
    },
    amenities: {
      type: [String],
      default: [],
    },
    availabilityDate: {
      type: Date,
      default: Date.now,
    },
    active: {
      type: Boolean,
      default: true,
    },
    // Compatibility Preferences
    preferredGender: {
      type: String,
      enum: ['Male', 'Female', 'Any'],
      default: 'Any',
    },
    preferredSleepSchedule: {
      type: String,
      enum: ['Early Bird', 'Night Owl', 'Flexible', 'Any'],
      default: 'Any',
    },
    smokingAllowed: {
      type: Boolean,
      default: true,
    },
    drinkingAllowed: {
      type: Boolean,
      default: true,
    },
    preferredCleanliness: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Any'],
      default: 'Any',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Property', propertySchema);
