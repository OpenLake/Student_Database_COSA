// routes/club.js
const express = require("express");
const router = express.Router();
const {
  OrganizationalUnit,
  Event,
  Position,
  PositionHolder,
  Achievement,
  Feedback,
} = require("../models/schema");
router.get("/clubData/:email", async (req, res) => {
  try {
    const email = req.params.email;
    if (!email) return res.status(400).json({ error: "Missing email" });

    const unit = await OrganizationalUnit.findOne({
      "contact_info.email": email,
    }).populate("parent_unit_id");
    if (!unit)
      return res.status(404).json({ error: "Organizational Unit not found" });

    const events = await Event.find({ organizing_unit_id: unit._id })
      .populate("participants")
      .populate("winners.user");
    const eventIds = events.map((e) => e._id);

    const achievements = await Achievement.find({ event_id: { $in: eventIds } })
      .populate("user_id")
      .populate("event_id")
      .populate("verified_by");

    const positions = await Position.find({ unit_id: unit._id }).populate(
      "unit_id",
    );
    const positionIds = positions.map((pos) => pos._id);

    const positionHolders = await PositionHolder.find({
      position_id: { $in: positionIds },
    })
      .populate("user_id")
      .populate("appointment_details.appointed_by")
      .populate({
        path: "position_id",
        populate: { path: "unit_id" },
      });

    const feedbacks = await Feedback.find({
      target_type: "Club/Organization",
      target_id: unit._id,
    })
      .populate("feedback_by")
      .populate("resolved_by");

    res.json({
      unit,
      events,
      positions,
      positionHolders,
      achievements,
      feedbacks,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
