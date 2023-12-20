const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()

const connectDB = async () => {
  try {
    const ConnectDB = `mongodb+srv://Snehil-Shah:Sneh9448999745@cluster.j4mlyq6.mongodb.net/?retryWrites=true&w=majority`;
    await mongoose.connect(ConnectDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}
// connectDB()

const closeDB = () => {
    mongoose.connection.close()
      .then(() => {
        console.log('MongoDB connection closed');
      })
      .catch((err) => {
        console.error('Error while closing MongoDB connection:', err);
      });
  };

// Call the connectDB function to establish the MongoDB connection


module.exports = {connectDB, closeDB};