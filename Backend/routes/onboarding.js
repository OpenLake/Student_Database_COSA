const express = require("express");
const router = express.Router();
const { User } = require("./../models/student");
const { Student } = require("./../models/student");
const { verifyToken } = require("../middlewares.js");
router.post("/", verifyToken, async (req, res) => {
  const { name, email, ID_No, add_year, Program, discipline, mobile_no } =
    req.body;

  try {
    // Check if student already exists
    const existingStudent = await Student.findOne({ ID_No });
    if (existingStudent) {
      return res
        .status(400)
        .json({ message: "Student with this ID already exists." });
    }

    // Create student record
    const newStudent = new Student({
      name,
      ID_No,
      email,
      Program,
      discipline,
      add_year,
      mobile_no: mobile_no | "",
    });
    await newStudent.save();

    // Update user onboarding status
    await User.findByIdAndUpdate(req.user._id, {
      onboardingComplete: true,
      ID_No: ID_No,
    });
    console.log("Onboarding completed for user:", req.user._id);
    res.status(200).json({ message: "Onboarding completed successfully" });
  } catch (error) {
    console.error("Onboarding failed:", error);
    res.status(500).json({ message: "Onboarding failed", error });
  }
});

module.exports = router;
