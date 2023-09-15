const mongoose = require("mongoose");
const dotenv = require("dotenv")

dotenv.config()


const connectDB = async () => {
  try {
    const ConnectDB = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cosa-database.xypqv4j.mongodb.net/?retryWrites=true&w=majority`;
    await mongoose.connect(ConnectDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}

// Call the connectDB function to establish the MongoDB connection
connectDB();

module.exports = connectDB;