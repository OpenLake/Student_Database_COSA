const mongoose = require("mongoose");
//achievements collection
const achievementSchema = new mongoose.Schema({
  achievement_id: {
    type: String,
    required: true,
    unique: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  category: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
  level: {
    type: String,
  },
  date_achieved: {
    type: Date,
    required: true,
  },
  position: {
    type: String,
  },
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    default: null, // optional
  },
  certificate_url: String,
  verified: {
    type: Boolean,
    default: false,
  },
  verified_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Achievement = mongoose.model("Achievement", achievementSchema);
module.exports = Achievement;
