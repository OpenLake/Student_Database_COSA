const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const authorizeRole = require("../middlewares/authorizeRole");
const { ROLE_GROUPS } = require("../utils/roles");
const feedbackController = require("../controllers/feedbackController");

router.post("/add", isAuthenticated, feedbackController.addFeedback);

router.get("/get-targetid", isAuthenticated, feedbackController.getTargetIds);

router.get("/view-feedback", feedbackController.viewFeedback);

// requires user middleware that attaches user info to req.user
router.put(
  "/mark-resolved/:id",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.ADMIN),
  feedbackController.markFeedbackResolved
);

//get all user given feedbacks
router.get("/:userId", isAuthenticated, feedbackController.getUserFeedbacks);

module.exports = router;
