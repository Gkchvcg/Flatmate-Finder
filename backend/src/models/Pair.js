import mongoose from 'mongoose';

const pairSchema = mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Matched', 'Completed'],
      default: 'Confirmed'
    },
    reviews: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: Number,
      comment: String
    }]
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Pair', pairSchema);

