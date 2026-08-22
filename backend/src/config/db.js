import mongoose from 'mongoose';

async function seedDemoData() {
  try {
    const User = (await import('../models/User.js')).default;
    const Property = (await import('../models/Property.js')).default;
    const count = await Property.countDocuments();
    if (count > 0) return;
    const demoUser = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah.demo@example.com',
      password: 'password123',
      city: 'New York',
      gender: 'Female',
      age: 26,
      cleanliness: 'High',
      sleepSchedule: 'Early Bird',
      occupation: 'Professional'
    });
    await Property.create([
      {
        creator: demoUser._id,
        title: 'Sunny Loft with Manhattan Skyline View',
        description: 'Spacious private room in a modern 2-bedroom loft. High ceilings, large windows, washer/dryer in unit, and easy subway access!',
        city: 'New York',
        area: 'Brooklyn Heights',
        rent: 1850,
        deposit: 1850,
        amenities: ['Wi-Fi', 'Gym', 'Laundry', 'Balcony', 'Dishwasher'],
        preferredGender: 'Any',
        preferredCleanliness: 'High',
        preferredSleepSchedule: 'Flexible',
        preferredOccupation: 'Professional',
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80']
      }
    ]);
    console.log('Seeded demo properties into MongoMemoryServer.');
  } catch (err) {
    console.warn('Demo seed failed:', err.message);
  }
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const isVercel = process.env.VERCEL === '1';
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (!process.env.MONGO_URI && (isVercel || isProduction)) {
       throw new Error('A valid MONGO_URI environment variable is required on Vercel. In-memory MongoDB cannot be used in serverless environments because data is lost between requests.');
    }

    const connectionUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flatmate-finder';
    
    cached.promise = mongoose.connect(connectionUri, { serverSelectionTimeoutMS: 5000 }).then((mongoose) => {
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
      return mongoose;
    }).catch(async (error) => {
      if (isVercel || isProduction) {
        throw new Error(`MongoDB connection failed. Set MONGO_URI in environment variables. ${error.message}`);
      }

      console.log(`Error connecting to provided MongoDB URI, falling back to mongodb-memory-server: ${error.message}`);
      process.env.MONGOMS_DOWNLOAD_DIR = '/tmp/mongodb-binaries';
      process.env.MONGOMS_RUNTIME_DIR = '/tmp/mongodb-runtime';
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create({
        binary: { version: '7.0.14', downloadDir: '/tmp/mongodb-binaries' }
      });
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected (Memory Server): ${conn.connection.host}`);
      await seedDemoData();
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
