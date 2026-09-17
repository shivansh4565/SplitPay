import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === '') {
    console.log('[Database] Running in-memory session engine (No MONGODB_URI configured).');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    if (error.message.includes('bad auth')) {
      console.warn('[MongoDB Notice] MongoDB Authentication failed. Please verify the username and password in server/.env.');
    } else {
      console.warn(`[MongoDB Notice] Could not connect to MongoDB (${error.message}).`);
    }
    console.log('[Database] Seamlessly running with built-in in-memory session engine.');
  }
};

export const getIsConnected = () => isConnected;