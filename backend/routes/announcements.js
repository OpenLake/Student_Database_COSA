const express = require("express");
const router = express.Router();
const {
  Announcement,
  Event,
  OrganizationalUnit,
  Position,
} = require("../models/schema");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { title, content, type, isPinned, targetEventId } = req.body;
    let targetId = null;

    if (type === "Event") {
      const event = await Event.findOne({
        $or: [{ _id: targetEventId }, { event_id: targetEventId }],
      });
      if (!event) {
        return res.status(404).send("No event found");
      }
      targetId = event.id;
    } else if (type === "OrganizationalUnit") {
      const orgUnit = await OrganizationalUnit.findOne({
        $or: [{ _id: targetEventId }, { event_id: targetEventId }],
      });
      if (!orgUnit) {
        return res.status(404).send("No Organizational Unit found");
      }
      targetId = orgUnit.id;
    } else if (type === "Position") {
      const pos = await Position.findOne({
        $or: [{ _id: targetEventId }, { event_id: targetEventId }],
      });
      if (!pos) {
        return res.status(404).send("No Position found");
      }
      targetId = pos.id;
    }

    const newAnnouncement = new Announcement({
      author: req.user._id,
      content,
      is_pinned: isPinned || false,
      title,
      type: type || "General",
      target_id: targetId,
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

// PUT /:id - update an announcement by id
router.put(
  "/:id",
  isAuthenticated,
  // allow authors, admins and gensec/president roles to update announcements
  // authorizeRole(["admin", "gen_sec", "president", "gensec"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string" || id.length !== 24) {
        return res.status(400).json({ error: "Invalid announcement id" });
      }

      const announcement = await Announcement.findById(id);
      if (!announcement) {
        return res.status(404).json({ error: "Announcement not found" });
      }

      // Only the author or privileged roles can update
      const isAuthor =
        announcement.author &&
        announcement.author.toString() === req.user._id.toString();
      const allowedRoles = ["admin", "gen_sec", "president", "gensec"];
      if (!isAuthor && !allowedRoles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ error: "Forbidden: cannot edit this announcement" });
      }

      const { title, content, type, target_id, isPinned } = req.body;
      if (title !== undefined) announcement.title = title;
      if (content !== undefined) announcement.content = content;
      if (type !== undefined) announcement.type = type;
      if (target_id !== undefined) announcement.target_id = target_id;
      if (typeof isPinned !== "undefined") announcement.is_pinned = !!isPinned;

      announcement.updatedAt = Date.now();
      await announcement.save();

      const populated = await Announcement.findById(announcement._id).populate(
        "author",
        "name email",
      );

      res.json(populated);
    } catch (error) {
      console.error("Error updating announcement:", error);
      res.status(500).json({ error: "Failed to update announcement" });
    }
  },
);

// DELETE /:id - delete an announcement by id
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string" || id.length !== 24) {
      return res.status(400).json({ error: "Invalid announcement id" });
    }

    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    // Only the author or privileged roles can delete
    const isAuthor =
      announcement.author &&
      announcement.author.toString() === req.user._id.toString();
    const allowedRoles = ["admin", "gen_sec", "president", "gensec"];
    if (!isAuthor && !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Forbidden: cannot delete this announcement" });
    }

    await Announcement.deleteOne({ _id: id });

    res.json({ message: "Announcement deleted", id });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({ error: "Failed to delete announcement" });
  }
});

module.exports = router;
