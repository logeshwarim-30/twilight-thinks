import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/twilight-thinks';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected to: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[Database] MongoDB not reachable at ${uri} (${error.message}).`);
    console.log(`[Database] Operating in Standalone High-Speed Engine mode with memory & local persistence.`);
    return false;
  }
};

export const getDbStatus = () => ({
  isConnected,
  mode: isConnected ? 'MongoDB' : 'Standalone Hybrid Engine'
});
