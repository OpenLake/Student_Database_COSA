const express = require("express");
const router = express.Router();
const { Position, PositionHolder } = require("../models/schema");
const { v4: uuidv4 } = require("uuid");

// POST for adding a new position
router.post("/add-position", async (req, res) => {
  try {
    const {
      title,
      unit_id,
      position_type,
      responsibilities,
      description,
      position_count,
      requirements,
    } = req.body;

    // Validation
    if (!title || !unit_id || !position_type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newPosition = new Position({
      position_id: uuidv4(),
      title,
      unit_id,
      position_type,
      responsibilities,
      description,
      position_count,
      requirements,
    });

    await newPosition.save();
    res.status(201).json(newPosition);
  } catch (error) {
    console.error("Error adding position:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// for getting all the position
router.get("/get-all", async (req, res) => {
  try {
    const positions = await Position.find().populate("unit_id", "name");
    res.json(positions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching positions." });
  }
});

//add position holder

router.post("/add-position-holder", async (req, res) => {
  try {
    const {
      user_id,
      position_id,
      tenure,
      appointment_details,
      performance_metrics,
      status,
    } = req.body;
    if (!user_id || !position_id || !tenure) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newPH = new PositionHolder({
      por_id: uuidv4(),
      user_id,
      position_id,
      tenure_year: tenure,
      appointment_details:
        appointment_details &&
        (appointment_details.appointed_by ||
          appointment_details.appointment_date)
          ? appointment_details
          : undefined,
      performance_metrics: {
        feedback:
          performance_metrics && performance_metrics.feedback
            ? performance_metrics.feedback.trim()
            : undefined,
        achievements:
          performance_metrics && performance_metrics.achievements
            ? performance_metrics.achievements.map((item) => item.trim())
            : [],
      },
      status,
    });

    const saved = await newPH.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error adding position holder:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
