const express = require("express");
const router = express.Router();
const { Achievement } = require("../models/schema"); // Update path as needed

// GET unverified achievements by type
router.get("/unendorsed/:type", async (req, res) => {
  const { type } = req.params;

  try {
    const unverifiedAchievements = await Achievement.find({
      type,
      verified: false,
    })
      .populate("user_id", "personal_info.name username user_id")
      .populate("event_id", "title description ");

    res.json(unverifiedAchievements);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to fetch unverified achievements." });
  }
});

// PATCH verify achievement by ID
router.patch("/verify/:id", async (req, res) => {
  const { id } = req.params;
  const { verified_by } = req.body; // Assuming you send the verifier's ID in the request body
  try {
    const achievement = await Achievement.findById(id);

    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found." });
    }

    achievement.verified = true;
    achievement.verified_by = verified_by;
    await achievement.save();

    res.json({ message: "Achievement verified successfully.", achievement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to verify achievement." });
  }
});

module.exports = router;
