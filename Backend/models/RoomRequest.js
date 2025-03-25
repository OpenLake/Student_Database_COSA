const mongoose = require("mongoose");

const RoomRequestSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  room: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
});

module.exports = mongoose.model("RoomRequest", RoomRequestSchema);
