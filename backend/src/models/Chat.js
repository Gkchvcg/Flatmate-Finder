import mongoose from 'mongoose';

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const chatSchema = mongoose.Schema(
  {
    pair: { type: mongoose.Schema.Types.ObjectId, ref: 'Pair', required: false },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [messageSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Chat', chatSchema);
