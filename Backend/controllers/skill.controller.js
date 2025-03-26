const { Skill } = require("../models/skill.model");
const { Student } = require("../models/student.model");

/**
 * Get all skills
 * @route GET /api/skills
 */
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find().populate("student", "ID_No name");
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get skills of a specific student
 * @route GET /api/skills/:studentId
 */
exports.getStudentSkills = async (req, res) => {
  try {
    const student = await Student.findOne({ ID_No: req.params.studentId });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    const skills = await Skill.find({ student: student._id });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Add a new skill
 * @route POST /api/skills
 */
exports.addSkill = async (req, res) => {
  try {
    const { studentId, skillName, skillType } = req.body;
    const student = await Student.findOne({ ID_No: studentId });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    const newSkill = new Skill({
      student: student._id,
      skillName,
      skillType,
    });
    await newSkill.save();
    res.status(201).json({ message: "Skill added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Error adding skill." });
  }
};

/**
 * Remove a skill
 * @route DELETE /api/skills/:studentId/:skillId
 */
exports.removeSkill = async (req, res) => {
  try {
    const student = await Student.findOne({ ID_No: req.params.studentId });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
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
};

// ==========================================
// TECH SKILLS
// ==========================================

/**
 * Get unendorsed tech skills
 * @route GET /api/skills/unendorsed/tech
 */
exports.getUnendorsedTechSkills = async (req, res) => {
  try {
    const skills = await Skill.find({
      skillType: "tech",
      endorsed: false,
    }).populate("student", "ID_No name");
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Endorse tech skill
 * @route PUT /api/skills/endorse/:skillId
 */
exports.endorseTechSkill = async (req, res) => {
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
};

// ==========================================
// ACADEMIC SKILLS
// ==========================================

/**
 * Get all academic skills
 * @route GET /api/skills/acad
 */

exports.getAllAcadSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ skillType: "acad" }).populate(
      "student",
      "ID_No name",
    );
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get unendorsed academic skills
 * @route GET /api/skills/unendorsed/acad
 */
exports.getUnendorsedAcadSkills = async (req, res) => {
  try {
    const skills = await Skill.find({
      skillType: "acad",
      endorsed: false,
    }).populate("student", "ID_No name");
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get endorsed academic skills
 * @route GET /api/skills/endorsed/acad
 */
exports.getEndorsedAcadSkills = async (req, res) => {
  try {
    const skills = await Skill.find({
      skillType: "acad",
      endorsed: true,
    }).populate("student", "ID_No name");
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get student academic skills
 * @route GET /api/skills/student/:studentId/acad
 */
exports.getStudentAcadSkills = async (req, res) => {
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
};

/**
 * Endorse academic skill
 * @route PUT /api/skills/endorse-acad/:skillId
 */
exports.endorseAcadSkill = async (req, res) => {
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
};

/**
 * Revoke academic skill endorsement
 * @route PUT /api/skills/revoke-endorsement/acad/:skillId
 */
exports.revokeAcadEndorsement = async (req, res) => {
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
};

// ==========================================
// SPORTS SKILLS
// ==========================================

/**
 * Get unendorsed sports skills
 * @route GET /api/skills/unendorsed/sport
 */
exports.getUnendorsedSportSkills = async (req, res) => {
  try {
    const skills = await Skill.find({
      skillType: "sport",
      endorsed: false,
    }).populate("student", "ID_No name");
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Endorse sports skill
 * @route PUT /api/skills/endorse-sport/:skillId
 */
exports.endorseSportSkill = async (req, res) => {
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
};

// ==========================================
// CULTURAL SKILLS
// ==========================================

/**
 * Get unendorsed cultural skills
 * @route GET /api/skills/unendorsed/cultural
 */
exports.getUnendorsedCulturalSkills = async (req, res) => {
  try {
    const skills = await Skill.find({
      skillType: "cultural",
      endorsed: false,
    }).populate("student", "ID_No name");
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get endorsed cultural skills
 * @route GET /api/skills/endorsed/cultural
 */
exports.getEndorsedCulturalSkills = async (req, res) => {
  try {
    const skills = await Skill.find({
      skillType: "cultural",
      endorsed: true,
    }).populate("student", "ID_No name");
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get student cultural skills
 * @route GET /api/skills/student/cultural/:studentId
 */
exports.getStudentCulturalSkills = async (req, res) => {
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
};

/**
 * Endorse cultural skill
 * @route PUT /api/skills/endorse-cultural/:skillId
 */
exports.endorseCulturalSkill = async (req, res) => {
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
};
