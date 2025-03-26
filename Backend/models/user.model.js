const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

/**
 * User Schema
 * Represents authentication and authorization information for users
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ID_No: {
      type: Number,
      unique: true,
      required: true,
    },
    role: {
      type: String,
      enum: [
        "student",
        "president",
        "gensec-scitech",
        "gensec-cult",
        "gensec-sports",
        "gensec-acad",
      ],
      required: true,
      default: "student",
    },
    strategy: {
      type: String,
      enum: ["local", "google"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

module.exports = { User };
