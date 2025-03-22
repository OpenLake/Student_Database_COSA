const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Event = require("../models/Event");
const RoomRequest = require("../models/RoomRequest");
const {Skill} = require("../models/skill");
const {
  Student,
  ScietechPOR,
  CultPOR,
  SportsPOR,
  AcadPOR,
  Achievement,
} = require("../models/student");

const Feedback = require("../models/Feedback");
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

router.get("/feedback", async(req,res)=>{
  try{
    const feedbacks= await Feedback.find();
    res.json(feedbacks);

  }
  catch(error){
    res.status(500).json({error: "Server error"});
  }
})

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
      achievements: achievements
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



router.put("/room/request/:id/status", authenticatePresident , async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await RoomRequest.findByIdAndUpdate(id, { status });
    res.send({ message: "Status updated" });
  } catch (error) {
    res.status(500).send({ error: "Error updating status" });
  }
});

// router.get("/skills/:id", async (req, res) => {
//   try {
//     const skills = await Skill.find({ student: req.params.id });
//     res.json(skills);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

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
// const { Skill } = require("../models/skill");
// const { Student } = require("../models/student");

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
      student: student._id,  // ✅ Store the correct ObjectId
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

// Endorse a skill
// router.put("/skills/endorse/:id", async (req, res) => {
//   const { role } = req.body; // role should be one of GenSecTech, GenSecAcad, GenSecSports, GenSecCultural
//   try {
//     const skill = await Skill.findById(req.params.id);
//     if (!skill) return res.status(404).json({ error: "Skill not found" });
    
//     const endorsementRoles = {
//       tech: "GenSecTech",
//       acad: "GenSecAcad",
//       sport: "GenSecSports",
//       cultural: "GenSecCultural",
//     };

//     if (endorsementRoles[skill.skillType] !== role) {
//       return res.status(403).json({ error: "Unauthorized endorsement" });
//     }

//     skill.endorsed = true;
//     await skill.save();
//     res.json(skill);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

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
      return res.status(404).json({ error: "Skill not found or doesn't belong to this student" });
    }

    res.json({ message: "Skill removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/skills/unendorsed/tech", async (req, res) => {
  try {
    const skills = await Skill.find({ skillType: "tech", endorsed: false }).populate("student", "ID_No name");
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


module.exports = router;
