const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
var findOrCreate = require("mongoose-findorcreate");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ID_No: {
    type: Number,
  },
  strategy: {
    type: String,
    enum: ["local", "google"],
    required: true,
  },
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// Define submodels for different 'pos_res' types

const student = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ID_No: {
    type: Number,
    required: true,
    unique: true,
  },
  Program: {
    type: String,
    required: true,
  },
  discipline: {
    type: String,
    required: true,
  },

  add_year: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        return Number.isInteger(value) && value > 2016;
      },
      message: "Invalid year of Admission",
    },
  },
});

const achievement = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student", // Reference the 'Student' model
    required: true,
  },
  under: { type: String },
  designation: { type: String, required: false },
  eventName: { type: String, required: false },
  conductedBy: { type: String, required: false },
});

const createPORSchema = (type) => {
  return new mongoose.Schema({
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", // Reference the 'Student' model
      required: true,
    },
    club: { type: String, required: true },
    designation: { type: String, required: true },
    session: { type: String, required: true },
    type: {
      type: String,
      default: type,
      immutable: true,
    },
  });
};

const scitech_por = createPORSchema("Scitech-POR");
const cult_por = createPORSchema("Cult-POR");
const sport_por = createPORSchema("Sport-POR");
const acad_por = createPORSchema("Acad-POR");
const User = mongoose.model("user", userSchema);
const Student = mongoose.model("Student", student);
const ScietechPOR = mongoose.model("ScietechPOR", scitech_por);
const CultPOR = mongoose.model("CultPOR", cult_por);
const SportsPOR = mongoose.model("SportSPOR", sport_por);
const AcadPOR = mongoose.model("AcadPOR", acad_por);
const Achievement = mongoose.model("Achievement", achievement);
module.exports = {
  Student,
  ScietechPOR,
  CultPOR,
  SportsPOR,
  AcadPOR,
  Achievement,
  User,
};
