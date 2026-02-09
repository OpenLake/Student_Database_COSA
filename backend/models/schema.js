const mongoose = require("mongoose");

//skill collection
const skillSchema = new mongoose.Schema({
  skill_id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["technical", "cultural", "sports", "academic", "other"],
    required: true,
  },
  description: {
    type: String,
  },
  is_endorsed: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

//user skill collection
const userSkillSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  skill_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
    required: true,
  },
  proficiency_level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced", "expert"],
    required: true,
  },
  // endorsements: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User' // users who endorsed the skill
  // }],
  position_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Position",
    default: null, // optional field
  },
  // verified_date: {
  //   type: Date
  // },
  is_endorsed: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

//announcement collection
const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["General", "Event", "Organizational_Unit", "Position"],
    required: true,
  },
  target_id: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "type",
  },
  is_pinned: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const UserSkill = mongoose.model("User_Skill", userSkillSchema);
const Skill = mongoose.model("Skill", skillSchema);
const Announcement = mongoose.model("Announcement", announcementSchema);

module.exports = {
  UserSkill,
  Skill,
  Announcement,
};
