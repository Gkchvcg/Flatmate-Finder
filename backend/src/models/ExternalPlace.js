import mongoose from 'mongoose';

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

export default mongoose.model('ExternalPlace', externalPlaceSchema);
