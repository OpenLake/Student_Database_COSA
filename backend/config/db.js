const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
  try {
    const ConnectDB = process.env.MONGODB_URI;
    //Removing the options as they are no longer needed from mongoose6+
    await mongoose.connect(ConnectDB);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
};
// connectDB()

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

// Call the connectDB function to establish the MongoDB connection

module.exports = { connectDB, closeDB };
