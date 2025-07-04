 

export const connectDB = async () => {
  try {
    const mongoose = await import('mongoose');
    const dotenv = await import('dotenv');
    dotenv.config(); 
    
    // Ensure MONGO_URI is defined in your .env file
    const conn = await mongoose.default.connect(process.env.MONGO_URI)

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // 1 is for failure, 0 is for success
  }
}