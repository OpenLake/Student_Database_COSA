const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const authorizeRole = require("../middlewares/authorizeRole");
const { ROLE_GROUPS } = require("../utils/roles");
const skillController = require("../controllers/skillController");

// GET unendorsed user skills for a particular skill type
router.get(
  "/user-skills/unendorsed/:type",
  isAuthenticated,
  skillController.getUnendorsedUserSkills
);

router.post(
  "/user-skills/endorse/:id",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.ADMIN),
  skillController.endorseUserSkill
);

// REJECT (delete) a user skill
router.post(
  "/user-skills/reject/:id",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.ADMIN),
  skillController.rejectUserSkill
);

// GET all unendorsed skills by type
router.get("/unendorsed/:type", isAuthenticated, skillController.getUnendorsedSkills);

// POST endorse a skill
router.post(
  "/endorse/:id",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.ADMIN),
  skillController.endorseSkill
);

// REJECT (delete) a skill
router.post(
  "/reject/:id",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.ADMIN),
  skillController.rejectSkill
);

//get all endorsed skills
router.get("/get-skills", isAuthenticated, skillController.getAllSkills);

//get all user skills (endorsed + unendorsed)
router.get("/user-skills/:userId", isAuthenticated, skillController.getUserSkills);

//create a new skill
router.post("/create-skill", isAuthenticated, skillController.createSkill);

//create new user skill
router.post("/create-user-skill", isAuthenticated, skillController.createUserSkill);

// GET top 5 most popular skills campus-wide
router.get("/top-skills", isAuthenticated, skillController.getTopSkills);

module.exports = router;
