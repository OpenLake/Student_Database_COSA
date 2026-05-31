const express = require("express");
const router = express.Router();
const { User } = require("../models/schema");
const isAuthenticated = require("../middlewares/isAuthenticated");

const onboardingController = require(
  "../controllers/onboardingController"
);

// Onboarding route - to be called when user logs in for the first time
router.post("/",isAuthenticated,onboardingController.completeOnboarding);

module.exports = router;
