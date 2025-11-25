import mongoose from "mongoose";

// Function to connect to the MogoDB database
const connectDB = async () => {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
        console.log('Database already connected');
        return;
    }

    mongoose.connection.on('connected', () => console.log('Database Connected'));

    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/job-portal`);
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
}

export default connectDB