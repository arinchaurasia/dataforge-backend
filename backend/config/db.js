const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Replace with your MongoDB URI (e.g., mongodb+srv://username:password@cluster.mongodb.net/dbname)
    const mongoURI = process.env.MONGO_URI; 
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
