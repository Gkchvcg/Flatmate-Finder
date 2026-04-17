import mongoose from 'mongoose';
import User from '../src/models/User.js';
import dotenv from 'dotenv';
dotenv.config();

async function listUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flatmate-finder');
    const users = await User.find({}, 'name email').lean();
    console.log('Registered Users:', JSON.stringify(users, null, 2));
    await mongoose.connection.close();
  } catch (error) {
    console.error(error);
  }
}

listUsers();
