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

// GET / - list announcements with filtering, search, pagination and sorting
router.get("/", async (req, res) => {
  try {
    const {
      type,
      author,
      isPinned,
      search,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filter = {};

    if (type) filter.type = type;
    if (author) filter.author = author;
    if (typeof isPinned !== "undefined") {
      // accept true/false or 1/0
      const val = `${isPinned}`.toLowerCase();
      filter.is_pinned = val === "true" || val === "1";
    }

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ title: regex }, { content: regex }];
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limNum = Math.max(parseInt(limit, 10) || 10, 1);

    const sortDirection = sortOrder === "asc" ? 1 : -1;
    const sort = { [sortBy]: sortDirection };

    const total = await Announcement.countDocuments(filter);
    const announcements = await Announcement.find(filter)
      .sort(sort)
      .skip((pageNum - 1) * limNum)
      .limit(limNum)
      .populate("author", "name email");

    res.json({
      total,
      page: pageNum,
      limit: limNum,
      totalPages: Math.ceil(total / limNum) || 0,
      announcements,
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
});

// GET /:id - fetch a single announcement by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string" || id.length !== 24) {
      return res.status(400).json({ error: "Invalid announcement id" });
    }

    const announcement = await Announcement.findById(id).populate(
      "author",
      "name email",
    );

    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    res.json(announcement);
  } catch (error) {
    console.error("Error fetching announcement by id:", error);
    res.status(500).json({ error: "Failed to fetch announcement" });
  }
});

module.exports = router;
