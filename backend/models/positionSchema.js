const mongoose = require("mongoose");

//position
const positionSchema = new mongoose.Schema({
  position_id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  unit_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organizational_Unit",
    required: true,
  },
  position_type: {
    type: String,
    required: true,
  },
  responsibilities: [
    {
      type: String,
    },
  ],
  requirements: {
    min_cgpa: {
      type: Number,
      default: 0,
    },
    min_year: {
      type: Number,
      default: 1,
    },
    skills_required: [
      {
        type: String,
      },
    ],
  },
  description: {
    type: String,
  },
  position_count: {
    type: Number,
  },

}, {timestamps: true});

const Position = mongoose.model("Position", positionSchema);
module.exports = Position;
