/**
 * config/db.js
 * MongoDB connection using Mongoose
 */

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error("⚠️  Check: 1) MongoDB Atlas IP whitelist  2) Username/password in .env");
    // Don't exit — let the server start so other errors are visible
  }
};

module.exports = connectDB;
