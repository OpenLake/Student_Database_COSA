const express = require("express");
const router = express.Router();
const Tenure = require("../models/Tenure");
const { verifyAdmin, verifyToken } = require("../middlewares.js");

// Add a new tenure record

const mongoose = require("mongoose"); // Ensure mongoose is imported

router.post("/", async (req, res) => {
  try {
    console.log("Received Data:", req.body);

    let { studentId, role, startDate, endDate, achievements } = req.body;

    if (!studentId || !role || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if studentId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        error: "Invalid studentId format. Must be a valid MongoDB ObjectId",
      });
    }

    const newTenure = new Tenure({
      studentId: new mongoose.Types.ObjectId(studentId),
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

// Get all tenure records
router.get("/", verifyToken, async (req, res) => {
  try {
    const records = await Tenure.find()
      .populate("studentId", "name _id")
      .select("studentId role achievements");
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch records" });
  }
});

// Get tenure records for a specific student
router.get("/:studentId", verifyToken, async (req, res) => {
  try {
    const studentId = new mongoose.Types.ObjectId(req.params.studentId);
    const records = await Tenure.find({ studentId })
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
