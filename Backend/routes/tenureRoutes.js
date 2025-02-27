const express = require("express");
const router = express.Router();
const Tenure = require("../models/Tenure");
const { verifyAdmin, verifyToken } = require("../middlewares.js");
const { Student } = require("../models/student"); // Adjust the path based on your project structure

// Add a new tenure record

const mongoose = require("mongoose"); // Ensure mongoose is imported

router.post("/", async (req, res) => {
  try {
    console.log("Received Data:", req.body);
    
    let { studentId, role, startDate, endDate, achievements } = req.body;

    if (!studentId || !role || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 🔹 Convert numeric studentId (roll number) into the correct ObjectId
    const student = await Student.findOne({ ID_No: studentId });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Create tenure record with the correct student _id
    const newTenure = new Tenure({
      studentId: student._id,  // Store the correct ObjectId
      role,
      startDate,
      endDate,
      achievements,
    });

    await newTenure.save();

    console.log("Record Saved:", newTenure);
    res.status(201).json(newTenure);
  } catch (error) {
    console.error("Error in POST /tenure:", error);
    res
      .status(500)
      .json({ error: "Failed to add tenure record", details: error.message });
  }
});
const moment =require("moment");
// Get all tenure records
router.get("/", verifyToken, async (req, res) => {
  try {
    const records = await Tenure.find()
      .populate({
        path: "studentId",
        select: "name ID_No",
      })
      .select("studentId role startDate endDate achievements");

    console.log("Fetched Records from DB:", JSON.stringify(records, null, 2)); // More detailed log

    const formattedRecords = records.map(record => ({
      studentName: record.studentId?.name || "Unknown",
      studentID: record.studentId?.ID_No || "N/A",
      role: record.role,
      tenurePeriod: `${moment(record.startDate).format("DD-MM-YYYY")} - ${moment(record.endDate).format("DD-MM-YYYY")}`,
      achievements: record.achievements || "No achievements listed",
    }));

    console.log("Formatted Records for Frontend:", JSON.stringify(formattedRecords, null, 2)); // Debugging log

    res.status(200).json(formattedRecords);
  } catch (error) {
    console.error("Error fetching tenure records:", error);
    res.status(500).json({ error: "Failed to fetch records", details: error.message });
  }
});


// Get tenure records for a specific student
router.get("/:studentId", verifyToken, async (req, res) => {
  try {
    const records = await Tenure.find({ studentId: req.params.studentId })
      .populate("studentId", "name _id")
      .select("studentId role achievements");
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch records" });
  }
});

// Update a tenure record
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const updatedTenure = await Tenure.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.status(200).json(updatedTenure);
  } catch (error) {
    res.status(500).json({ error: "Failed to update record" });
  }
});

// Delete a tenure record
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Tenure.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Record deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete record" });
  }
});

module.exports = router;