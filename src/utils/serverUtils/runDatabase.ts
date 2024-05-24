import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const runDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
};

export default runDatabase;