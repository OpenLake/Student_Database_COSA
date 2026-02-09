const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
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
    password: {
      type: String,
      required: function () {
        return this.strategy === "local";
      },
      minLength: 8,
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
        required: true,
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
  },
  {
    timestamps: true,
  },
);

userSchema.index(
  { user_id: 1 },
  {
    unique: true,
    partialFilterExpression: { user_id: { $exists: true, $type: "string" } },
    name: "user_id_partial_unique",
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, Number(process.env.SALT));
});
const User = mongoose.model("User", userSchema);
module.exports = User;
