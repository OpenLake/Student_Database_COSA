const mongoose = require("mongoose");

//feedback collection
const feedbackSchema = new mongoose.Schema({
  feedback_id: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
  },
  target_id: {
    type: mongoose.Schema.Types.ObjectId,
    //required: true,
    // We'll dynamically interpret this field based on target_type
  },
  target_type: {
    type: String,
    required: true,
  },
  feedback_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // category: {
  //   type: String,
  //   enum: ['organization', 'communication', 'leadership'],
  //   required: true
  // },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  comments: {
    type: String,
  },
  is_anonymous: {
    type: Boolean,
    default: false,
  },
  is_resolved: {
    type: Boolean,
    default: false,
  },
  actions_taken: {
    type: String,
    default: "",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  resolved_at: {
    type: Date,
    default: null,
  },
  resolved_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
