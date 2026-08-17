import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const connectionUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flatmate-finder';
    cached.promise = mongoose.connect(connectionUri, { serverSelectionTimeoutMS: 5000 }).then((mongoose) => {
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
      return mongoose;
    }).catch(async (error) => {
      const isVercel = process.env.VERCEL === '1';
      const isProduction = process.env.NODE_ENV === 'production';

      if (isVercel || isProduction) {
        throw new Error(`MongoDB connection failed. Set MONGO_URI in environment variables. ${error.message}`);
      }

      console.log(`Error connecting to provided MongoDB URI, falling back to mongodb-memory-server: ${error.message}`);
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected (Memory Server): ${conn.connection.host}`);
      return conn;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

export default connectDB;
