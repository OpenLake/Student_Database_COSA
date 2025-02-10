const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const {
  Student,
  ScietechPOR,
  CultPOR,
  SportsPOR,
  AcadPOR,
} = require("../models/student");
const Feedback = require("../models/Feedback");
router.post("/feedback", async (req, res) => {
  try {
    let { userId, type, description } = req.body;

    console.log("Received request:", req.body); // Debugging: Log incoming request

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid userId format:", userId);
      return res.status(400).json({ error: "Invalid userId format" });
    }

    const feedback = new Feedback({ userId, type, description });
    await feedback.save();

    console.log("Feedback saved successfully:", feedback);
    res.status(201).json({ message: "Feedback submitted", feedback });
  } catch (error) {
    console.error("Error in /feedback route:", error); // Print full error
    res.status(500).json({ error: error.message }); // Send exact error message
  }
});

router.get("/feedback/:userId", async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ userId: req.params.userId });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

router.post("/fetch", async (req, res) => {
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
    const PORs = [...scitechPor, ...cultPor, ...sportPor, ...acadPor];

    const st = {
      student: student,
      PORS: PORs,
    };
    return res.status(200).json(st);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: "process failed" });
  }
});

module.exports = router;
