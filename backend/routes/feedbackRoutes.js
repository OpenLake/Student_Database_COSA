const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  User,
  Feedback,
  Event,
  Position,
  OrganizationalUnit,
} = require("./../models/schema");
const { v4: uuidv4 } = require("uuid");
const authorizeRole = require("../middlewares/authorizeRole");
const { ROLE_GROUPS } = require("../utils/roles");

router.post("/add", isAuthenticated, async (req, res) => {
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

    const targetModels = {
      User,
      Event,
      "Club/Organization": OrganizationalUnit,
      POR: Position,
    };

    const TargetModel = targetModels[target_type];

    if (!TargetModel) {
      return res.status(400).json({ message: "Invalid target type" });
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

router.get("/get-targetid", isAuthenticated, async (req, res) => {
  try {
    const users = await User.find(
      { role: "STUDENT" },
      "_id user_id personal_info.name",
    );
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

router.get("/view-feedback", async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate("feedback_by", "personal_info.name username")
      .sort({ created_at: -1 });

    const populatedFeedback = await Promise.all(
      feedback.map(async (fb) => {
        let targetData = null;

        switch (fb.target_type) {
          case "User":
            targetData = await User.findById(fb.target_id).select(
              "personal_info.name user_id username",
            );
            break;

          case "Event": {
            const event = await Event.findById(fb.target_id).select(
              "title organizing_unit_id",
            );
            if (event) {
              const orgUnit = await OrganizationalUnit.findById(
                event.organizing_unit_id,
              ).select("name");
              targetData = {
                title: event.title,
                organizing_unit: orgUnit ? orgUnit.name : "N/A",
              };
            }
            break;
          }

          case "Club/Organization": {
            const org = await OrganizationalUnit.findById(fb.target_id).select(
              "name parent_unit_id",
            );
            if (org) {
              const parent = await OrganizationalUnit.findById(
                org.parent_unit_id,
              ).select("name");
              targetData = {
                name: org.name,
                parent: parent ? parent.name : "N/A",
              };
            }
            break;
          }

          case "POR": {
            const position = await Position.findById(fb.target_id).select(
              "title unit_id",
            );
            if (position) {
              const unit = await OrganizationalUnit.findById(
                position.unit_id,
              ).select("name");
              targetData = {
                title: position.title,
                unit: unit ? unit.name : "N/A",
              };
            }
            break;
          }

          default:
            targetData = null;
            break;
        }
        const fbObj = fb.toObject();
        fbObj.target_data = targetData;
        return fbObj;
      }),
    );
    res.status(200).json(populatedFeedback);
  } catch (error) {
    console.error("Error viewing feedback:", error);
    res.status(500).json({ message: "Failed to retrieve feedback" });
  }
});

// requires user middleware that attaches user info to req.user
router.put(
  "/mark-resolved/:id",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.ADMIN),
  async (req, res) => {
    const feedbackId = req.params.id;
    const { actions_taken, resolved_by } = req.body;
    console.log(req.body);
    console.log("User resolving feedback:", resolved_by);

    if (!actions_taken || actions_taken.trim() === "") {
      return res.status(400).json({ error: "Resolution comment is required." });
    }

    try {
      const feedback = await Feedback.findById(feedbackId);
      if (!feedback) {
        return res.status(404).json({ error: "Feedback not found" });
      }

      if (feedback.is_resolved) {
        return res.status(400).json({ error: "Feedback is already resolved." });
      }

      feedback.is_resolved = true;
      feedback.resolved_at = new Date();
      feedback.actions_taken = actions_taken;
      feedback.resolved_by = resolved_by;

      await feedback.save();

      res.json({ success: true, message: "Feedback marked as resolved." });
    } catch (err) {
      console.error("Error updating feedback:", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

//get all user given feedbacks
router.get("/:userId", isAuthenticated, async (req, res) => {
  const userId = req.params.userId;
  try {
    const userFeedbacks = await Feedback.find({ feedback_by: userId }).populate(
      "resolved_by",
      "personal_info.name username user_id",
    );
    res.json(userFeedbacks);
  } catch (err) {
    console.error("Failed to get user Feedbacks:", err);
    res.status(500).json({ message: "Failed to get user Feedbacks." });
  }
});
module.exports = router;
