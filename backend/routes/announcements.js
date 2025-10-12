const express = require("express");
const router = express.Router();
const { Announcement } = require("../models/schema");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { title, content, type, isPinned } = req.body;
    const newAnnouncement = new Announcement({
      title,
      content,
      author: req.user._id,
      type: type || "General",
      is_pinned: isPinned || false,
    });
    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({ error: "Failed to create announcement" });
  }
});

module.exports = router;
