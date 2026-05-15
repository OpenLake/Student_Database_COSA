const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const authorizeRole = require("../middlewares/authorizeRole");
const { ROLE_GROUPS } = require("../utils/roles");
const achievementController = require("../controllers/achievementController");

// GET unverified achievements by type (achievements which are pending to verify fetched by admins only)
router.get(
  "/unendorsed/:type",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.ADMIN),
  achievementController.getUnendorsedAchievements
);

// PATCH verify achievement by ID (achievements can be verified by admins only)
router.patch(
  "/verify/:id",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.ADMIN),
  achievementController.verifyAchievement
);

// REJECT (delete) achievement by ID
router.post(
  "/reject/:id",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.ADMIN),
  achievementController.rejectAchievement
);

//add achievement (achievements can be added by all the users (students -> their own ahieve, admins -> council achieve + student achieve))
router.post("/add", isAuthenticated, achievementController.addAchievement);

//get all user achievements (endorsed + unendorsed) (must be accessible by the user themselves and admins, so all users)
router.get("/:userId", isAuthenticated, achievementController.getUserAchievements);

module.exports = router;
