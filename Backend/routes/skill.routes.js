const express = require("express");
const router = express.Router();
const skillController = require("../controllers/skill.controller");
const {
  isAuthenticated,
  verifyAdmin,
} = require("../middleware/auth.middleware");

// General skill routes
router.get("/", isAuthenticated, skillController.getAllSkills);
router.get("/:studentId", isAuthenticated, skillController.getStudentSkills);
router.post("/", isAuthenticated, skillController.addSkill);
router.delete(
  "/:studentId/:skillId",
  isAuthenticated,
  skillController.removeSkill,
);

// Tech skill routes
router.get(
  "/unendorsed/tech",
  isAuthenticated,
  skillController.getUnendorsedTechSkills,
);
router.put(
  "/endorse/:skillId",
  isAuthenticated,
  verifyAdmin,
  skillController.endorseTechSkill,
);

// Academic skill routes
router.get("/acad", isAuthenticated, skillController.getAllAcadSkills);
router.get(
  "/unendorsed/acad",
  isAuthenticated,
  skillController.getUnendorsedAcadSkills,
);
router.get(
  "/endorsed/acad",
  isAuthenticated,
  skillController.getEndorsedAcadSkills,
);
router.get(
  "/student/:studentId/acad",
  isAuthenticated,
  skillController.getStudentAcadSkills,
);
router.put(
  "/endorse-acad/:skillId",
  isAuthenticated,
  verifyAdmin,
  skillController.endorseAcadSkill,
);
router.put(
  "/revoke-endorsement/acad/:skillId",
  isAuthenticated,
  verifyAdmin,
  skillController.revokeAcadEndorsement,
);

// Sports skill routes
router.get(
  "/unendorsed/sport",
  isAuthenticated,
  skillController.getUnendorsedSportSkills,
);
router.put(
  "/endorse-sport/:skillId",
  isAuthenticated,
  verifyAdmin,
  skillController.endorseSportSkill,
);

// Cultural skill routes
router.get(
  "/unendorsed/cultural",
  isAuthenticated,
  skillController.getUnendorsedCulturalSkills,
);
router.get(
  "/endorsed/cultural",
  isAuthenticated,
  skillController.getEndorsedCulturalSkills,
);
router.get(
  "/student/cultural/:studentId",
  isAuthenticated,
  skillController.getStudentCulturalSkills,
);
router.put(
  "/endorse-cultural/:skillId",
  isAuthenticated,
  verifyAdmin,
  skillController.endorseCulturalSkill,
);

module.exports = router;
