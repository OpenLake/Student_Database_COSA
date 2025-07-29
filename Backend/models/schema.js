const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
var findOrCreate = require("mongoose-findorcreate");
//user collection

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    unique: true,
    //user_id is the ID provided by institute, ie ID no
  },
  role: {
    type: String,
    required: true,
  },
  strategy: {
    type: String,
    enum: ["local", "google"],
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  onboardingComplete: {
    type: Boolean,
    default: false,
  },
  personal_info: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: String,
    date_of_birth: Date,
    gender: String,

    profilePic: {
      type: String,
      default: "https://www.gravatar.com/avatar/?d=mp",
    },

    cloudinaryUrl: {
      type: String,
      default: "",
    },
  },

  academic_info: {
    program: {
      type: String,
      //enum: ["B.Tech", "M.Tech", "PhD", "Msc","other"],
    },
    branch: String,
    batch_year: String,
    current_year: String,
    cgpa: Number,
  },

  contact_info: {
    hostel: String,
    room_number: String,
    socialLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      instagram: { type: String, default: "" },
      other: { type: String, default: "" },
    },
  },

  status: {
    type: String,
    enum: ["active", "inactive", "graduated"],
    default: "active",
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
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

//organizational unit
const organizationalUnitSchema = new mongoose.Schema({
  unit_id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Council", "Club", "Committee", "independent_position"],
    required: true,
  },
  description: {
    type: String,
  },
  parent_unit_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organizational_Unit",
    default: null,
  },
  hierarchy_level: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ["cultural", "scitech", "sports", "academic", "independent"],
    required: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  contact_info: {
    email: {
      type: String,
    },
    social_media: {
      type: Object,
    },
  },
  budget_info: {
    allocated_budget: {
      type: Number,
      default: 0,
    },
    spent_amount: {
      type: Number,
      default: 0,
    },
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
  created_at: {
    type: Date,
    default: Date.now,
  },
});

//position holder collection;
const positionHolderSchema = new mongoose.Schema({
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
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

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
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

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
    enum: ["technical", "cultural", "sports", "academic"],
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

const User = mongoose.model("User", userSchema);
const Feedback = mongoose.model("Feedback", feedbackSchema);
const Achievement = mongoose.model("Achievement", achievementSchema);
const UserSkill = mongoose.model("User_Skill", userSkillSchema);
const Skill = mongoose.model("Skill", skillSchema);
const Event = mongoose.model("Event", eventSchema);
const PositionHolder = mongoose.model("Position_Holder", positionHolderSchema);
const Position = mongoose.model("Position", positionSchema);
const OrganizationalUnit = mongoose.model(
  "Organizational_Unit",
  organizationalUnitSchema,
);

module.exports = {
  User,
  Feedback,
  Achievement,
  UserSkill,
  Skill,
  Event,
  PositionHolder,
  Position,
  OrganizationalUnit,
};
