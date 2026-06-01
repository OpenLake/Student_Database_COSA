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

// GET club data
exports.getClubData = async (req, res) => {
  try {
    const email = req.params.email;

    if (!email || email.trim() === "") {
      return res.status(400).json({
        error: "Missing email",
      });
    }

    const unit = await OrganizationalUnit.findOne({
      "contact_info.email": email,
    }).populate("parent_unit_id");

    if (!unit) {
      return res.status(404).json({
        error: "Organizational Unit not found",
      });
    }

    const events = await Event.find({
      organizing_unit_id: unit._id,
    })
      .populate("participants")
      .populate("winners.user");

    const eventIds = events.map((e) => e._id);

    const achievements = await Achievement.find({
      event_id: { $in: eventIds },
    })
      .populate("user_id")
      .populate("event_id")
      .populate("verified_by");

    const positions = await Position.find({
      unit_id: unit._id,
    }).populate("unit_id");

    const positionIds = positions.map(
      (pos) => pos._id
    );

    const positionHolders =
      await PositionHolder.find({
        position_id: {
          $in: positionIds,
        },
      })
        .populate("user_id")
        .populate(
          "appointment_details.appointed_by"
        )
        .populate({
          path: "position_id",
          populate: {
            path: "unit_id",
          },
        });

    const feedbacks = await Feedback.find({
      target_type: "Club/Organization",
      target_id: unit._id,
    })
      .populate("feedback_by")
      .populate("resolved_by");

    return res.json({
      unit,
      events,
      positions,
      positionHolders,
      achievements,
      feedbacks,
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      error: "Server error",
    });
  }
};

// GET organizational units
exports.getOrganizationalUnits =
  async (req, res) => {
    try {
      const { category, type } =
        req.query;

      const filter = {};

      if (category) {
        filter.category = category;
      }

      if (type) {
        filter.type = type;
      }

      const units =
        await OrganizationalUnit.find(
          filter
        ).sort({
          name: 1,
        });

      return res.status(200).json(units);
    } catch (error) {
      return res.status(500).json({
        message:
          "Server error while fetching organizational units",
        error,
      });
    }
  };

// CREATE organizational unit
exports.createOrganizationalUnit =
  async (req, res) => {
    const session =
      await mongoose.startSession();

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
        parent_unit_id:
          parent_unit_id || null,
        hierarchy_level,
        category,
        is_active,
        contact_info,
        budget_info,
      };

      const newUnit =
        new OrganizationalUnit(
          newUnitData
        );

      await newUnit.save({
        session,
      });

      const existingUser =
        await User.findOne({
          username:
            contact_info.email,
        }).session(session);

      if (existingUser) {
        await session.abortTransaction();
        session.endSession();

        return res.status(409).json({
          message:
            "A user with this email already exists. The organizational unit was not created.",
        });
      }

      const newUser = new User({
        username:
          contact_info.email,
        role: "CLUB_COORDINATOR",
        strategy: "google",
        onboardingComplete: true,
        personal_info: {
          name: name,
          email:
            contact_info.email,
        },
      });

      await newUser.save({
        session,
      });

      await session.commitTransaction();
      session.endSession();

      return res.status(201).json(
        newUnit
      );
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      console.error(
        "Error creating organizational unit and user:",
        error
      );

      if (
        error.name ===
          "ValidationError" ||
        error.name === "CastError"
      ) {
        return res.status(400).json({
          message: `Invalid data provided: ${error.message}`,
        });
      }

      if (error.code === 11000) {
        return res.status(409).json({
          message:
            "Conflict: An organizational unit with this name or ID already exists.",
        });
      }

      return res.status(500).json({
        message:
          "Server error while creating organizational unit.",
      });
    }
  };