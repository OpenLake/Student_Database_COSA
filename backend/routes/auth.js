const express = require("express");
const router = express.Router();
const passport = require("../models/passportConfig");
const rateLimit = require("express-rate-limit");
const isAuthenticated = require("../middlewares/isAuthenticated");
const authController = require("../controllers/authController");

//rate limiter - for password reset try
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many password reset requests. Please try again later.",
});
// Session Status

router.get("/fetchAuth", isAuthenticated, authController.fetchAuth);

// Local Authentication
router.post("/login", passport.authenticate("local"), authController.login);

router.post("/register", authController.register);

// Google OAuth Authentication
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/verify",
  passport.authenticate("google", { failureRedirect: "/" }),
  authController.googleCallback
);

router.post("/logout", authController.logout);

//routes for forgot-password
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  authController.forgotPassword
);

//route for password reset
router.get("/reset-password/:id/:token", authController.verifyResetToken);

router.post("/reset-password/:id/:token", authController.resetPassword);

module.exports = router;
