const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // User ID (can be email or DB ID)
  type: {
    type: String,
    enum: ["Suggestion", "Complaint", "Query"],
    required: true,
  },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["Open", "In Progress", "Resolved"],
    default: "Open",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Feedback", FeedbackSchema);
