// routes/club.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const {
  OrganizationalUnit,
  Event,
  Position,
  PositionHolder,
  Achievement,
  Feedback,
  User,
} = require("../models/schema");
const isAuthenticated = require("../middlewares/isAuthenticated");
const authorizeRole = require("../middlewares/authorizeRole");
const { ROLE_GROUPS } = require("../utils/roles");

router.get("/clubData/:email", isAuthenticated, async (req, res) => {
  try {
    const email = req.params.email;
    if (!email) {
      return res.status(400).json({ error: "Missing email" });
    }

    const unit = await OrganizationalUnit.findOne({
      "contact_info.email": email,
    }).populate("parent_unit_id");
    if (!unit) {
      return res.status(404).json({ error: "Organizational Unit not found" });
    }

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

// Fetches all units, or filters by category if provided in the query.
router.get("/organizational-units", isAuthenticated, async (req, res) => {
  try {
    const { category, type } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }
    if (type) {
      filter.type = type;
    }
    const units = await OrganizationalUnit.find(filter).sort({
      name: 1,
    });
    res.status(200).json(units);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching organizational units",
      error,
    });
  }
});

// Create a new organizational unit
router.post(
  "/create",
  isAuthenticated,
  authorizeRole([...ROLE_GROUPS.GENSECS, "PRESIDENT"]),
  async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const {
        name,
        type,
        description,
        parent_unit_id,
        hierarchy_level,
        category,
        is_active,
        contact_info,
        budget_info,
      } = req.body;

      if (
        !name ||
        !type ||
        !category ||
        !hierarchy_level ||
        !contact_info.email
      ) {
        return res.status(400).json({
          message:
            "Validation failed: name, type, category, and hierarchy_level are required.",
        });
      }

      const newUnitData = {
        unit_id: `org-${uuidv4()}`,
        name,
        type,
        description,
        parent_unit_id: parent_unit_id || null,
        hierarchy_level,
        category,
        is_active,
        contact_info,
        budget_info,
      };

      const newUnit = new OrganizationalUnit(newUnitData);
      await newUnit.save(session);

      const existingUser = await User.findOne({
        username: contact_info.email,
      }).session(session);
      if (existingUser) {
        // If user exists, we must abort the transaction to avoid an inconsistent state
        await session.abortTransaction();
        session.endSession();
        return res.status(409).json({
          message:
            "A user with this email already exists. The organizational unit was not created.",
        });
      }

      const newUser = new User({
        username: contact_info.email,
        role: "CLUB_COORDINATOR", // Assign the specified role
        strategy: "google", // Set strategy to google
        onboardingComplete: true, // Set onboarding to true
        personal_info: {
          name: name, // Use the organization's name for the user's name
          email: contact_info.email,
        },
      });
      await newUser.save({ session }); // Pass the session to the save command

      // --- 5. If both operations were successful, commit the transaction ---
      await session.commitTransaction();
      session.endSession();

      res.status(201).json(newUnit);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error creating organizational unit and user: ", error);

      if (error.name === "ValidationError" || error.name === "CastError") {
        return res
          .status(400)
          .json({ message: `Invalid data provided: ${error.message}` });
      }

      if (error.code === 11000) {
        return res.status(409).json({
          message:
            "Conflict: An organizational unit with this name or ID already exists.",
        });
      }

      res
        .status(500)
        .json({ message: "Server error while creating organizational unit." });
    }
  },
);
module.exports = router;
