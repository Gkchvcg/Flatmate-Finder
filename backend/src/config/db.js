const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flatmate-finder', { serverSelectionTimeoutMS: 2000 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error connecting to provided MongoDB URI, falling back to mongodb-memory-server: ${error.message}`);
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected (Memory Server): ${conn.connection.host}`);
  }
};

module.exports = connectDB;
