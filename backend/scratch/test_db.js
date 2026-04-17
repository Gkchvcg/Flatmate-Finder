import mongoose from 'mongoose';
import User from '../src/models/User.js';
import dotenv from 'dotenv';
dotenv.config();

async function testDB() {
  try {
    const connectionUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flatmate-finder';
    await mongoose.connect(connectionUri);
    console.log('Connected to DB');

    const testEmail = 'test-' + Date.now() + '@example.com';
    const user = await User.create({
      name: 'Test User',
      email: testEmail,
      password: 'password123'
    });
    console.log('User created:', user._id);

    const foundUser = await User.findOne({ email: testEmail });
    console.log('User found:', foundUser?.email);

    await User.findByIdAndDelete(user._id);
    console.log('User deleted');

    await mongoose.connection.close();
  } catch (error) {
    console.error('DB test error:', error);
    process.exit(1);
  }
}

testDB();
