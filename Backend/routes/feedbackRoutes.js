console.log("✅ feedback.js loaded");

const express = require("express");
const router = express.Router();
const {
  User,
  Feedback,
  Event,
  Position,
  OrganizationalUnit,
} = require("./../models/schema");
const { v4: uuidv4 } = require("uuid");
router.post("/add", async (req, res) => {
  try {
    const {
      type,
      target_type,
      target_id,
      feedback_by,
      rating,
      comments,
      is_anonymous,
    } = req.body;

    if (!type || !target_type || !target_id || !feedback_by) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const feedback = new Feedback({
      feedback_id: uuidv4(),
      type,
      target_type,
      target_id,
      feedback_by,
      rating,
      comments,
      is_anonymous: is_anonymous === "ture" || is_anonymous === true,
    });

    await feedback.save();
    console.log("Feedback added successfully:", feedback);
    res
      .status(201)
      .json({ message: "Feedback submitted successfully", feedback });
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
});

router.get("/get-targetid", async (req, res) => {
  try {
    const users = await User.find({}, "_id user_id personal_info.name");
    const events = await Event.find({}, "_id title");
    const organizational_units = await OrganizationalUnit.find({}, "_id name");
    const positions = await Position.find({})
      .populate("unit_id", "name")
      .select("_id title unit_id");

    const formattedUsers = users.map((user) => ({
      _id: user._id,
      name: user.personal_info.name,
      user_id: user.user_id,
    }));

    const formattedPositions = positions.map((position) => ({
      _id: position._id,
      title: position.title,
      unit: position.unit_id ? position.unit_id.name : "N/A",
    }));

    res.json({
      users: formattedUsers,
      events,
      organizational_units,
      positions: formattedPositions,
    });
  } catch (error) {
    console.error("Error fetching target ID:", error);
    res.status(500).json({ message: "Failed to fetch target IDs" });
  }
});
router.get("/test", (req, res) => {
  console.log("✅ /test hit");
  res.send("Test OK");
});

module.exports = router;
