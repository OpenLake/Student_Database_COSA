const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 150,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
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
    validate: {
      validator: (value) => Array.isArray(value) && value.length > 0,
      message: "At least one assignee is required",
    },
  },
  unit_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organizational_Unit",
    default: null,
  },
  deadline: {
    type: Date,
    required: true,
  },
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
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  submission_note: {
    type: String,
    default: "",
    trim: true,
    maxlength: 2000,
  },
  admin_notes: {
    type: String,
    default: "",
    trim: true,
    maxlength: 2000,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

taskSchema.index({ assignees: 1, status: 1 });
taskSchema.index({ assigned_by: 1, status: 1 });

taskSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.models.Task || mongoose.model("Task", taskSchema);