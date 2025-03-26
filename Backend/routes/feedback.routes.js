const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedback.controller");

router.get("/", feedbackController.getAllFeedback);
router.post("/", feedbackController.submitFeedback);
router.get("/:userId", feedbackController.getUserFeedback);

module.exports = router;
