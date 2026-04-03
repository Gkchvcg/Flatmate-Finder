const mongoose = require('mongoose');

const externalPlaceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    address: {
      type: String,
    },
    city: {
      type: String,
      index: true,
    },
    rating: {
      type: Number,
    },
    source: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ExternalPlace', externalPlaceSchema);
