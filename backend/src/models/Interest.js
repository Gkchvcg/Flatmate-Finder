const mongoose = require('mongoose');

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
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate interests from the same user for the same property
interestSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

module.exports = mongoose.model('Interest', interestSchema);
