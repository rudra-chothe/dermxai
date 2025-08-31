import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dermx-ai';
    
    const conn = await mongoose.connect(mongoURI);

    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB reconnected');
      isConnected = true;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('📴 MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    isConnected = false;
    
    // For development, continue without MongoDB
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️  Running in development mode without MongoDB');
    } else {
      process.exit(1);
    }
  }
};

// Check if MongoDB is available
export const isMongoDBAvailable = () => {
  return isConnected && mongoose.connection.readyState === 1;
};

export { connectDB };
export default connectDB;