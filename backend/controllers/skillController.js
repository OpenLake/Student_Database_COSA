const { UserSkill, Skill } = require("../models/schema");
const { v4: uuidv4 } = require("uuid");

// GET unendorsed user skills for a particular skill type
exports.getUnendorsedUserSkills = async (req, res) => {
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
};

exports.endorseUserSkill = async (req, res) => {
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
};

// REJECT (delete) a user skill
exports.rejectUserSkill = async (req, res) => {
    const skillId = req.params.id;

    try {
        const deletedSkill = await UserSkill.findByIdAndDelete(skillId);

        if (!deletedSkill) {
            return res.status(404).json({
                message: "User skill not found",
            });
        }

        res.json({
            message: "User skill rejected and deleted successfully",
        });
    } catch (err) {
        console.error("Error rejecting user skill:", err);
        res.status(500).json({
            message: "Error rejecting user skill",
        });
    }
};

// GET all unendorsed skills by type
exports.getUnendorsedSkills = async (req, res) => {
    const skillType = req.params.type;

    try {
        const skills = await Skill.find({ type: skillType, is_endorsed: false });
        res.json(skills);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching unendorsed skills." });
    }
};

// POST endorse a skill
exports.endorseSkill = async (req, res) => {
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
};

// REJECT (delete) a skill
exports.rejectSkill = async (req, res) => {
    const skillId = req.params.id;

    try {
        const deletedSkill = await Skill.findByIdAndDelete(skillId);

        if (!deletedSkill) {
            return res.status(404).json({
                message: "Skill not found",
            });
        }

        res.json({
            message: "Skill rejected and deleted successfully",
        });
    } catch (err) {
        console.error("Error rejecting skill:", err);
        res.status(500).json({
            message: "Failed to reject skill",
        });
    }
};

//get all endorsed skills
exports.getAllSkills = async (req, res) => {
    try {
        const skills = await Skill.find({ is_endorsed: true });
        res.json(skills);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get endorsed skills." });
    }
};

//get all user skills (endorsed + unendorsed)
exports.getUserSkills = async (req, res) => {
    const userId = req.params.userId;
    try {
        const userSkills = await UserSkill.find({ user_id: userId })
            .populate("skill_id")
            .populate({
                path: "position_id",
                populate: {
                    path: "unit_id",
                    select: "name",
                },
            });
        res.json(userSkills);
    } catch (err) {
        console.error("Failed to get user skills:", err);
        res.status(500).json({ message: "Failed to get user skills." });
    }
};

//create a new skill
exports.createSkill = async (req, res) => {
    try {
        const { name, category, type, description } = req.body;
        const skill = new Skill({
            skill_id: uuidv4(),
            name,
            category,
            type,
            description,
        });
        await skill.save();
        res.status(201).json(skill);
    } catch (err) {
        res.status(500).json({ error: "Failed to add skill" });
    }
};

//create new user skill
exports.createUserSkill = async (req, res) => {
    try {
        const { user_id, skill_id, proficiency_level, position_id } = req.body;

        const newUserSkill = new UserSkill({
            user_id,
            skill_id,
            proficiency_level,
            position_id: position_id || null,
        });

        await newUserSkill.save();
        res.status(201).json(newUserSkill);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add user skill" });
    }
};

// GET top 5 most popular skills campus-wide
exports.getTopSkills = async (req, res) => {
    try {
        const topSkills = await UserSkill.aggregate([
            { $match: { is_endorsed: true } },
            { $group: { _id: "$skill_id", totalUsers: { $sum: 1 } } },
            { $sort: { totalUsers: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "skills",
                    localField: "_id",
                    foreignField: "_id",
                    as: "skillDetails",
                },
            },
            { $unwind: "$skillDetails" },
            {
                $project: {
                    _id: 0,
                    skillName: "$skillDetails.name",
                    type: "$skillDetails.type",
                    totalUsers: 1,
                },
            },
        ]);

        res.json(topSkills);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching top skills." });
    }
};
