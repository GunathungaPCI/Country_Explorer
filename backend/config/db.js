
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    // Log more details about the error
    console.error(err);
    console.log('Please check your MongoDB connection string and make sure your network allows the connection');
    // Don't exit immediately to allow seeing the error
    setTimeout(() => {
      process.exit(1);
    }, 3000);
  }
};

export default connectDB;