import Chat from '../models/Chat.js';
import Pair from '../models/Pair.js';

// Get or create chat for a pair
export const getOrCreateChat = async (req, res, next) => {
  try {
    const { pairId } = req.params;

    const pair = await Pair.findById(pairId);
    if (!pair) {
      res.status(404);
      throw new Error('Pair not found');
    }

    // Ensure requester is part of the pair
    const userId = req.user._id.toString();
    if (pair.user1.toString() !== userId && pair.user2.toString() !== userId) {
      res.status(403);
      throw new Error('Not authorized to access this chat');
    }

    let chat = await Chat.findOne({ pair: pairId })
      .populate('messages.sender', 'name email')
      .populate('participants', 'name email');

    if (!chat) {
      chat = await Chat.create({ pair: pairId, participants: [pair.user1, pair.user2], messages: [] });
      chat = await chat.populate('participants', 'name email');
    }

    res.json(chat);
  } catch (error) {
    next(error);
  }
};

// Post a message to chat
export const postMessage = async (req, res, next) => {
  try {
    const { pairId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      res.status(400);
      throw new Error('Message text is required');
    }

    const pair = await Pair.findById(pairId);
    if (!pair) {
      res.status(404);
      throw new Error('Pair not found');
    }

    const userId = req.user._id.toString();
    if (pair.user1.toString() !== userId && pair.user2.toString() !== userId) {
      res.status(403);
      throw new Error('Not authorized to post in this chat');
    }

    let chat = await Chat.findOne({ pair: pairId });
    if (!chat) {
      chat = await Chat.create({ pair: pairId, participants: [pair.user1, pair.user2], messages: [] });
    }

    const message = { sender: req.user._id, text, readBy: [req.user._id] };
    chat.messages.push(message);
    await chat.save();

    // populate the last pushed message sender
    const populated = await Chat.findById(chat._id).populate('messages.sender', 'name email');

    res.status(201).json(populated.messages[populated.messages.length - 1]);
  } catch (error) {
    next(error);
  }
};

// Mark messages as read by the current user
export const markRead = async (req, res, next) => {
  try {
    const { pairId } = req.params;
    const pair = await Pair.findById(pairId);
    if (!pair) {
      res.status(404);
      throw new Error('Pair not found');
    }

    const userId = req.user._id.toString();
    if (pair.user1.toString() !== userId && pair.user2.toString() !== userId) {
      res.status(403);
      throw new Error('Not authorized');
    }

    const chat = await Chat.findOne({ pair: pairId });
    if (!chat) return res.json({ success: true });

    chat.messages.forEach((m) => {
      if (!m.readBy.map(String).includes(userId)) {
        m.readBy.push(userId);
      }
    });

    await chat.save();
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
