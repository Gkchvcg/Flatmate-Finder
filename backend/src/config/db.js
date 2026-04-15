const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connectionUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flatmate-finder';
    const conn = await mongoose.connect(connectionUri, { serverSelectionTimeoutMS: 2000 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    const isVercel = process.env.VERCEL === '1';
    const isProduction = process.env.NODE_ENV === 'production';

    if (isVercel || isProduction) {
      throw new Error(`MongoDB connection failed. Set MONGO_URI in environment variables. ${error.message}`);
    }

    console.log(`Error connecting to provided MongoDB URI, falling back to mongodb-memory-server: ${error.message}`);
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected (Memory Server): ${conn.connection.host}`);
  }
};

module.exports = connectDB;
