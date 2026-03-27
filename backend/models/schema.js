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

}, { timestamps: true});

const UserSkill = mongoose.model("User_Skill", userSkillSchema);
const Skill = mongoose.model("Skill", skillSchema);
const Announcement = mongoose.model("Announcement", announcementSchema);

const roomSchema = new mongoose.Schema({
  room_id: {
    type: String,
    required: true,
    unique: true,
    default: () => `ROOM_${uuidv4()}`,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  amenities: [
    {
      type: String,
    },
  ],
  allowed_roles: {
    type: [
      {
        type: String,
        enum: [
          "PRESIDENT",
          "GENSEC_SCITECH",
          "GENSEC_ACADEMIC",
          "GENSEC_CULTURAL",
          "GENSEC_SPORTS",
          "CLUB_COORDINATOR",
          "STUDENT",
        ],
      },
    ],
    default: [
      "PRESIDENT",
      "GENSEC_SCITECH",
      "GENSEC_ACADEMIC",
      "GENSEC_CULTURAL",
      "GENSEC_SPORTS",
      "CLUB_COORDINATOR",
    ],
  },
  is_active: {
    type: Boolean,
    default: true,
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

const Room = mongoose.model("Room", roomSchema);

const roomBookingSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        if (!this.startTime || !value) {
          return false;
        }
        return value > this.startTime;
      },
      message: "endTime must be after startTime",
    },
  },
  purpose: {
    type: String,
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Cancelled"],
    default: "Pending",
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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

roomBookingSchema.index({ room: 1, date: 1, startTime: 1, endTime: 1 });

const RoomBooking = mongoose.model("RoomBooking", roomBookingSchema);

module.exports = {
  UserSkill,
  Skill,
  Announcement,
  Room,
  RoomBooking,
};
