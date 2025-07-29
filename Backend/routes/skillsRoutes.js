const express = require("express");
const router = express.Router();
const { UserSkill, Skill } = require("../models/schema");

// GET unendorsed user skills for a particular skill type
router.get("/user-skills/unendorsed/:type", async (req, res) => {
  const skillType = req.params.type; // e.g. "cultural", "sports"

  try {
    const skills = await UserSkill.find({ is_endorsed: false })
      .populate({
        path: "skill_id",
        match: { type: skillType },
      })
      .populate("user_id", "personal_info.name username user_id") // optionally fetch user info
      .populate("position_id", "title");

    // Filter out null populated skills (i.e., skill type didn't match)
    const filtered = skills.filter((us) => us.skill_id !== null);

    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching unendorsed skills." });
  }
});

router.post("/user-skills/endorse/:id", async (req, res) => {
  const skillId = req.params.id;
  try {
    const userSkill = await UserSkill.findById(skillId);
    if (!userSkill) {
      return res.status(404).json({ message: "User skill not found" });
    }
    userSkill.is_endorsed = true;
    await userSkill.save();
    res.json({ message: "User skill endorsed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error endorsing user skill" });
  }
});

// GET all unendorsed skills by type
router.get("/unendorsed/:type", async (req, res) => {
  const skillType = req.params.type;

  try {
    const skills = await Skill.find({ type: skillType, is_endorsed: false });
    res.json(skills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching unendorsed skills." });
  }
});

// POST endorse a skill
router.post("/endorse/:id", async (req, res) => {
  const skillId = req.params.id;

  try {
    const skill = await Skill.findById(skillId);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    skill.is_endorsed = true;
    await skill.save();

    res.json({ message: "Skill endorsed successfully", skill });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to endorse skill." });
  }
});

module.exports = router;
