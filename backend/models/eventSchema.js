const mongoose = require("mongoose");

//events collection
const eventSchema = new mongoose.Schema({
  event_id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  category: {
    type: String,
    enum: ["cultural", "technical", "sports", "academic", "other"],
  },
  type: {
    type: String,
  },
  organizing_unit_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organizational_Unit",
    required: true,
  },
  organizers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  schedule: {
    start: Date,
    end: Date,
    venue: String,
    mode: {
      type: String,
      enum: ["online", "offline", "hybrid"],
    },
  },
  registration: {
    required: Boolean,
    start: Date,
    end: Date,
    fees: Number,
    max_participants: Number,
  },
  budget: {
    allocated: Number,
    spent: Number,
    sponsors: [
      {
        type: String,
      },
    ],
  },
  status: {
    type: String,
    enum: ["planned", "ongoing", "completed", "cancelled"],
    default: "planned",
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  winners: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      position: String, // e.g., "1st", "2nd", "Best Speaker", etc.
    },
  ],
  feedback_summary: {
    type: Object, // You can define structure if fixed
  },
  media: {
    images: [String],
    videos: [String],
    documents: [String],
  },
  room_requests: [
    {
      date: { type: Date, required: true },
      time: { type: String, required: true },
      room: { type: String, required: true },
      description: { type: String },
      status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
      },
      requested_at: {
        type: Date,
        default: Date.now,
      },
      reviewed_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],

}, { timestamps: true});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
