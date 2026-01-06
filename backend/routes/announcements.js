const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {
  Announcement,
  Event,
  OrganizationalUnit,
  Position,
} = require("../models/schema");
const isAuthenticated = require("../middlewares/isAuthenticated");

const findTargetId = async (type, identifier) => {
  let target = null;

  if (type === "Event") {
    target = await Event.findOne({
      $or: [{ _id: identifier }, { event_id: identifier }],
    });
  } else if (type === "OrganizationalUnit") {
    target = await OrganizationalUnit.findOne({
      $or: [{ _id: identifier }, { unit_id: identifier }], // FIXED
    });
  } else if (type === "Position") {
    target = await Position.findOne({
      $or: [{ _id: identifier }, { position_id: identifier }], // FIXED
    });
  }

  return target ? target._id : null;
};

router.post("/", isAuthenticated, async (req, res) => {
  try {
    const {
      title,
      content,
      type = "General",
      isPinned,
      targetIdentifier,
    } = req.body;
    let targetId = null;

    if (type != "General" && targetIdentifier) {
      targetId = await findTargetId(type, targetIdentifier);
      if (!targetId) {
        return res
          .status(404)
          .json({ error: `No ${type} found with that identifier` });
      }
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
    if (isPinned !== "undefined") {
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
      .populate("author", "username personal_info.email personal_info.name");

    if (filter.type && filter.type !== "General") {
      announcements.populate("target_id");
    }

    res.json({
      total,
      page: pageNum,
      limit: limNum,
      totalPages: Math.ceil(total / limNum) || 0,
      announcements,
    });
    console.log(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
});

// GET /:id - fetch a single announcement by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid announcement id" });
    }

    const announcement = await Announcement.findById(id)
      .populate("author", "username personal_info.email personal_info.name")
      .populate("target_id");

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

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid announcement id" });
      }

      const announcement = await Announcement.findById(id);
      if (!announcement) {
        return res.status(404).json({ error: "Announcement not found" });
      }

      // Only the author
      const isAuthor =
        announcement.author &&
        announcement.author.toString() === req.user._id.toString();
      if (!isAuthor) {
        return res
          .status(403)
          .json({ error: "Forbidden: cannot edit this announcement" });
      }

      const { title, content, type, targetIdentifier, isPinned } = req.body;
      if (title !== undefined) announcement.title = title;
      if (content !== undefined) announcement.content = content;
      if (isPinned !== undefined) announcement.is_pinned = Boolean(isPinned);

      if (type || targetIdentifier) {
        const newType = type || announcement.type;

        const newIdentifier =
          targetIdentifier ||
          (announcement.target_id ? announcement.target_id.toString() : null);

        if (newType === "General") {
          announcement.type = "General";
          announcement.target_id = null;
        } else {
          if (!newIdentifier) {
            return res.status(400).json({
              error:
                "targetIdentifier is required when setting a non-General type",
            });
          }
          const newTargetId = await findTargetId(newType, newIdentifier);
          if (!newTargetId) {
            return res.status(404).json({
              error: `Target ${newType} not found with identifier ${newIdentifier}`,
            });
          }
          announcement.target_id = newTargetId;
          announcement.type = newType;
        }
      }

      announcement.updatedAt = Date.now();
      await announcement.save();

      const populated = await announcement.populate([
        {
          path: "author",
          select: "username personal_info.email personal_info.name",
        },
      ]);
      if (announcement.type !== "General") {
        populated.populate("target_id");
      }
      res.json(populated);
    } catch (error) {
      console.error("Error updating announcement:", error);
      res.status(500).json({ error: error.message, stack: error.stack });
    }
  },
);

// DELETE /:id - delete an announcement by id
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid announcement id" });
    }

    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    // Only the author
    const isAuthor =
      announcement.author &&
      announcement.author.toString() === req.user._id.toString();
    if (!isAuthor) {
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
