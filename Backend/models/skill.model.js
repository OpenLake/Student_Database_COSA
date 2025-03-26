const mongoose = require("mongoose");

/**
 * Skill Schema
 * Represents skills possessed by students that can be endorsed
 */
const skillSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  skillName: {
    type: String,
    required: true,
  },
  skillType: {
    type: String,
    enum: ["tech", "acad", "sport", "cultural"],
    required: true,
  },
  endorsed: {
    type: Boolean,
    default: false,
  },
  endorsedDate: {
    type: Date,
    default: null,
  },
  endorsedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

const Skill = mongoose.model("Skill", skillSchema);

module.exports = { Skill };
