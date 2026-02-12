const express = require("express");
const router = express.Router();
const controller = require("../controllers/analyticsController");
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const authorizeRole = require("../middlewares/authorizeRole");
const { ROLE_GROUPS } = require("../utils/roles");

// Route to get analytics for president
router.get(
  "/president",
  isAuthenticated,
  authorizeRole(["PRESIDENT"]),
  controller.getPresidentAnalytics,
);

// Route to get analytics for gensecs
router.get(
  "/gensec",
  isAuthenticated,
  authorizeRole([...ROLE_GROUPS.GENSECS]),
  controller.getGensecAnalytics,
);

// Route to get analytics for club coordinators
router.get(
  "/club-coordinator",
  authorizeRole(["CLUB_COORDINATOR"]),
  isAuthenticated,
  controller.getClubCoordinatorAnalytics,
);

// Route to get analytics for students
router.get(
  "/student",
  isAuthenticated,
  authorizeRole(["STUDENT"]),
  controller.getStudentAnalytics,
);

module.exports = router;
