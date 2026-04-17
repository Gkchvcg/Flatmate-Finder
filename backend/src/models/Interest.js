import mongoose from 'mongoose';

const interestSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Property',
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending',
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate interests from the same user for the same property
interestSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

export default mongoose.model('Interest', interestSchema);
