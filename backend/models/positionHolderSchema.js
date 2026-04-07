const mongoose = require("mongoose");

//position holder collection;
const positionHolderSchema = new mongoose.Schema(
  {
    por_id: {
      type: String,
      required: true,
      unique: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    position_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Position",
      required: true,
    },

    tenure_year: {
      type: String,
      required: true,
    },
    appointment_details: {
      appointed_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      appointment_date: {
        type: Date,
      },
    },
    performance_metrics: {
      events_organized: {
        type: Number,
        default: 0,
      },
      budget_utilized: {
        type: Number,
        default: 0,
      },
      feedback: {
        type: String,
      },
    },
    status: {
      type: String,
      enum: ["active", "completed", "terminated"],
      required: true,
    },
  },
  { timestamps: true },
);

const PositionHolder = mongoose.model("Position_Holder", positionHolderSchema);
module.exports = PositionHolder;
