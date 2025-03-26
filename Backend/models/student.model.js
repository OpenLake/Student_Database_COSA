const mongoose = require("mongoose");

/**
 * Student Schema
 * Represents academic details of a student
 */
const studentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
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

/**
 * Achievement Schema
 * Represents a student's achievements
 */
const achievementSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  under: { type: String },
  designation: { type: String, required: false },
  eventName: { type: String, required: false },
  conductedBy: { type: String, required: false },
});

/**
 * Factory function to create Position of Responsibility schemas
 * @param {string} type - Type of POR (Scitech, Cultural, Sports, Academic)
 */
const createPORSchema = (type) => {
  return new mongoose.Schema({
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
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

const ScietechPOR = mongoose.model(
  "ScietechPOR",
  createPORSchema("Scitech-POR"),
);
const CultPOR = mongoose.model("CultPOR", createPORSchema("Cult-POR"));
const SportsPOR = mongoose.model("SportsPOR", createPORSchema("Sport-POR"));
const AcadPOR = mongoose.model("AcadPOR", createPORSchema("Acad-POR"));
const Student = mongoose.model("Student", studentSchema);
const Achievement = mongoose.model("Achievement", achievementSchema);

module.exports = {
  Student,
  ScietechPOR,
  CultPOR,
  SportsPOR,
  AcadPOR,
  Achievement,
};
