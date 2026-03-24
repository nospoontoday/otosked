import mongoose from 'mongoose';

async function connectDB() {
    try {
        const uri = `${process.env.MONGODB_URI}:${process.env.MONGODB_PORT}/${process.env.MONGODB_NAME}` || 'mongodb://localhost:27020/otosked';
        await mongoose.connect(uri);
        console.log(`MongoDB connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}
  
export default connectDB;