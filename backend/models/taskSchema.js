const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    assigned_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignees: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      required: true,
    },
    unit_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizational_Unit",
      required: true,
    },
    deadline: { type: Date, required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "under-review", "completed"],
      default: "pending",
    },
    progress: { type: Number, default: 0, max: 100 },
    submission_note: { type: String, default: "" }, // Link to work (Drive/Doc) or description
    admin_notes: { type: String, default: "" }, // Feedback from the assigner
  },
  { timestamps: true },
);

module.exports = mongoose.model("Task", taskSchema);
