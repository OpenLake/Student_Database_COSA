const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Event = require("../models/Event");
const RoomRequest = require("../models/RoomRequest");
const { Skill } = require("../models/skill");
const {
  Student,
  ScietechPOR,
  CultPOR,
  SportsPOR,
  AcadPOR,
  Achievement,
} = require("../models/student");
const Feedback = require("../models/Feedback");

router.get("/", (req, res) => {
  res.json({
    message: "API is running successfully",
    status: "healthy",
    timestamp: new Date().toISOString(),
    endpoints: {
      feedback: "POST /feedback, GET /feedback, GET /feedback/:userId",
      events: "POST /events, GET /events, DELETE /events/:id",
      rooms:
        "POST /room/request, GET /room/requests, PUT /room/request/:id/status",
      skills: "GET /skills, POST /skills, DELETE /skills/:studentId/:skillId",
      student: "POST /fetch",
    },
  });
});

router.post("/feedback", async (req, res) => {
  try {
    let { userId, type, description } = req.body;

    console.log("Received request:", req.body); // Debugging: Log incoming request

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid userId format:", userId);
      return res.status(400).json({ error: "Invalid userId format" });
    }

    const feedback = new Feedback({ userId, type, description });
    await feedback.save();

    console.log("Feedback saved successfully:", feedback);
    res.status(201).json({ message: "Feedback submitted", feedback });
  } catch (error) {
    console.error("Error in /feedback route:", error); // Print full error
    res.status(500).json({ error: error.message }); // Send exact error message
  }
});

router.get("/feedback/:userId", async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ userId: req.params.userId });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/feedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/fetch", async (req, res) => {
  try {
    const student = await Student.findOne({ ID_No: req.body.student_ID });

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    const scitechPor = await ScietechPOR.find({ student: student });
    const cultPor = await CultPOR.find({ student: student });
    const sportPor = await SportsPOR.find({ student: student });
    const acadPor = await AcadPOR.find({ student: student });
    const achievements = await Achievement.find({ student: student });
    const PORs = [...scitechPor, ...cultPor, ...sportPor, ...acadPor];

    const st = {
      student: student,
      PORS: PORs,
      achievements: achievements,
    };

    return res.status(200).json(st);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: "process failed" });
  }
});

const checkConflict = async (startTime, endTime, gap = 4 * 60 * 60 * 1000) => {
  const startWithGap = new Date(startTime.getTime() - gap);
  const endWithGap = new Date(endTime.getTime() + gap);
  const conflictingEvents = await Event.find({
    $or: [
      { startTime: { $lt: endWithGap }, endTime: { $gt: startWithGap } }, // Adjusted logic
    ],
  });
  return conflictingEvents.length > 0;
};

router.post("/events", async (req, res) => {
  const { title, startTime, endTime } = req.body;
  if (await checkConflict(new Date(startTime), new Date(endTime))) {
    return res
      .status(400)
      .json({ message: "Event conflicts with an existing event." });
  }
  const event = new Event({ title, startTime, endTime });
  await event.save();
  res.status(201).json(event);
});

router.get("/events", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

router.delete("/events/:id", async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: "Event deleted" });
});

router.post("/room/request", async (req, res) => {
  try {
    const request = new RoomRequest(req.body);
    await request.save();
    res.send({ message: "Request submitted", request });
  } catch (error) {
    res.status(500).send({ error: "Error submitting request" });
  }
});

// View all booking requests
router.get("/room/requests", async (req, res) => {
  try {
    const requests = await RoomRequest.find();
    res.send(requests);
  } catch (error) {
    res.status(500).send({ error: "Error fetching requests" });
  }
});

// Update request status
const authenticatePresident = (req, res, next) => {
  // if (req.user.role !== "president") {
  //   return res.status(403).send({ message: "Unauthorized" });
  // }
  next();
};

router.put(
  "/room/request/:id/status",
  authenticatePresident,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await RoomRequest.findByIdAndUpdate(id, { status });
      res.send({ message: "Status updated" });
    } catch (error) {
      res.status(500).send({ error: "Error updating status" });
    }
  },
);

// Get skills of a student
router.get("/skills/:studentId", async (req, res) => {
  try {
    const student = await Student.findOne({ ID_No: req.params.studentId });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Fetch skills using the student's ObjectId
    const skills = await Skill.find({ student: student._id });

    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new skill

router.post("/skills", async (req, res) => {
  try {
    const { studentId, skillName, skillType } = req.body;

    // 🔹 Find the student in the database using ID_No (not _id)
    const student = await Student.findOne({ ID_No: studentId });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // 🔹 Use the student's ObjectId (_id) to link the skill
    const newSkill = new Skill({
      student: student._id, // ✅ Store the correct ObjectId
      skillName,
      skillType,
    });

    await newSkill.save();
    res.status(201).json({ message: "Skill added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Error adding skill." });
  }
});

router.get("/skills", async (req, res) => {
  try {
    const skills = await Skill.find().populate("student", "ID_No name");
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove a skill
router.delete("/skills/:studentId/:skillId", async (req, res) => {
  try {
    const student = await Student.findOne({ ID_No: req.params.studentId });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Delete the specific skill of this student
    const skill = await Skill.findOneAndDelete({
      _id: req.params.skillId,
      student: student._id,
    });

    if (!skill) {
      return res
        .status(404)
        .json({ error: "Skill not found or doesn't belong to this student" });
    }

    res.json({ message: "Skill removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/skills/unendorsed/tech", async (req, res) => {
  try {
    const skills = await Skill.find({
      skillType: "tech",
      endorsed: false,
    }).populate("student", "ID_No name");
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/skills/endorse/:skillId", async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.skillId);
    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    if (skill.skillType !== "tech") {
      return res.status(403).json({ error: "Unauthorized endorsement" });
    }

    skill.endorsed = true;
    await skill.save();
    res.json({ message: "Skill endorsed successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes for GenSecAcad skills management

/**
 * Get all unendorsed academic skills
 * This route fetches all academic skills that haven't been endorsed yet
 */
router.get("/skills/unendorsed/acad", async (req, res) => {
  try {
    const skills = await Skill.find({
      skillType: "acad",
      endorsed: false,
    }).populate("student", "ID_No name");
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Endorse an academic skill
 * This route allows GenSecAcad to endorse an academic skill
 */
router.put("/skills/endorse-acad/:skillId", async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.skillId);
    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    if (skill.skillType !== "acad") {
      return res.status(403).json({
        error: "Unauthorized endorsement. This skill is not academic.",
      });
    }

    skill.endorsed = true;
    await skill.save();
    res.json({ message: "Academic skill endorsed successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get all academic skills (both endorsed and unendorsed)
 * This allows GenSecAcad to view all academic skills in the system
 */
router.get("/skills/acad", async (req, res) => {
  try {
    const skills = await Skill.find({ skillType: "acad" }).populate(
      "student",
      "ID_No name",
    );
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get endorsed academic skills
 * This route fetches all academic skills that have been endorsed
 */
router.get("/skills/endorsed/acad", async (req, res) => {
  try {
    const skills = await Skill.find({
      skillType: "acad",
      endorsed: true,
    }).populate("student", "ID_No name");
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get student academic skills
 * This route fetches all academic skills for a specific student
 */
router.get("/skills/student/:studentId/acad", async (req, res) => {
  try {
    const student = await Student.findOne({ ID_No: req.params.studentId });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const skills = await Skill.find({
      student: student._id,
      skillType: "acad",
    });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Revoke endorsement for an academic skill
 * This route allows GenSecAcad to revoke an endorsement
 */
router.put("/skills/revoke-endorsement/acad/:skillId", async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.skillId);
    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    if (skill.skillType !== "acad") {
      return res
        .status(403)
        .json({ error: "Unauthorized action. This skill is not academic." });
    }

    skill.endorsed = false;
    await skill.save();
    res.json({ message: "Academic skill endorsement revoked successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/skills/unendorsed/sport", async (req, res) => {
  try {
    const skills = await Skill.find({
      skillType: "sport",
      endorsed: false,
    }).populate("student", "ID_No name");
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endorse a sports skill
router.put("/skills/endorse-sport/:skillId", async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.skillId);
    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    if (skill.skillType !== "sport") {
      return res.status(403).json({
        error: "Unauthorized endorsement. This is not a sports skill.",
      });
    }

    skill.endorsed = true;
    await skill.save();
    res.json({ message: "Sports skill endorsed successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Include these routes in your skill routes file

// Get all unendorsed cultural skills
router.get("/skills/unendorsed/cultural", async (req, res) => {
  try {
    const skills = await Skill.find({
      skillType: "cultural",
      endorsed: false,
    }).populate("student", "ID_No name");
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endorse a cultural skill
router.put("/skills/endorse-cultural/:skillId", async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.skillId);
    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    if (skill.skillType !== "cultural") {
      return res.status(403).json({ error: "Unauthorized endorsement" });
    }

    skill.endorsed = true;
    await skill.save();
    res.json({ message: "Cultural skill endorsed successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add more specific routes for cultural skills if needed
// For example, to get all endorsed cultural skills:
router.get("/skills/endorsed/cultural", async (req, res) => {
  try {
    const skills = await Skill.find({
      skillType: "cultural",
      endorsed: true,
    }).populate("student", "ID_No name");
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// To get a student's cultural skills:
router.get("/skills/student/cultural/:studentId", async (req, res) => {
  try {
    const student = await Student.findOne({ ID_No: req.params.studentId });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const skills = await Skill.find({
      student: student._id,
      skillType: "cultural",
    });

    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
