// const mongoose = require("mongoose");

// const FeedbackSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
//   type: {
//     type: String,
//     enum: ["Suggestion", "Complaint", "Query"],
//     required: true,
//   },
//   description: { type: String, required: true },
//   status: {
//     type: String,
//     enum: ["Open", "In Progress", "Resolved"],
//     default: "Open",
//   },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Feedback", FeedbackSchema);
