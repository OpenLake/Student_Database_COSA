const mongoose = require("mongoose");
require("dotenv").config();

/**
 * Connects to MongoDB using the connection string in environment variables
 */
const connectDB = async () => {
  try {
    const connectionString = process.env.MONGODB_URI;
    mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw new Error("Failed to connect to MongoDB: " + error.message);
  }
};

/**
 * Closes the MongoDB connection
 */
const closeDB = () => {
  mongoose.connection
    .close()
    .then(() => {
      console.log("MongoDB connection closed");
    })
    .catch((err) => {
      console.error("Error while closing MongoDB connection:", err);
    });
};

module.exports = { connectDB, closeDB };
