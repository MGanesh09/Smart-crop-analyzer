const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_crop';
    // Ensure database name is appended if using Atlas URI without one
    const finalUri = uri.includes('/smart_crop') ? uri : uri.replace('/?', '/smart_crop?').replace(/\/$/, '/smart_crop');
    const conn = await mongoose.connect(finalUri, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.dbError = null;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    global.dbError = error.message;
    console.warn('WARNING: Running server without an active MongoDB connection. Mongoose operations will queue.');
  }
};

module.exports = connectDB;
