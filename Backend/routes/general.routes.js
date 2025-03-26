const express = require("express");
const router = express.Router();
const {
  Student,
  ScietechPOR,
  CultPOR,
  SportsPOR,
  AcadPOR,
  Achievement,
} = require("../models/student.model");

const { isAuthenticated } = require("../middleware/auth.middleware");

// ==========================================
// STUDENT PROFILE ROUTES
// ==========================================

// Update student profile
router.post("/update-profile", isAuthenticated, async (req, res) => {
  try {
    const { ID_No, name } = req.user;
    const { program, discipline, yearOfAdmission } = req.body;
    const student = new Student({
      name,
      ID_No,
      user_id: req.user._id,
      Program: program,
      discipline,
      add_year: yearOfAdmission,
    });
    await student.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Fetch student data
router.post("/fetch", isAuthenticated, async (req, res) => {
  try {
    const student = await Student.findOne({ ID_No: req.body.student_ID });

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    const scitechPor = await ScietechPOR.find({ student: student });
    const cultPor = await CultPOR.find({ student: student });
    const sportPor = await SportsPOR.find({ student: student });
    const acadPor = await AcadPOR.find({ student: student });
    const achievements = await Achievement.find({ student: student });
    const PORs = [...scitechPor, ...cultPor, ...sportPor, ...acadPor];

    const st = {
      student: student,
      PORS: PORs,
      achievements: achievements,
    };

    return res.status(200).json(st);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: "process failed" });
  }
});

module.exports = router;
