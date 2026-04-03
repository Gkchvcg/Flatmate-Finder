const mongoose = require('mongoose');

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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Property', propertySchema);
