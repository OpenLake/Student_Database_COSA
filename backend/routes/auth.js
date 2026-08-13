const express = require("express");
const router = express.Router();

//const secretKey = process.env.JWT_SECRET_TOKEN;

const passport = require("../models/passportConfig");
const rateLimit = require("express-rate-limit");
const isAuthenticated= require("../middlewares/isAuthenticated");
const authController = require("../controllers/authController");

//rate limiter - for password reset try
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many password reset requests. Please try again later.",
});

// rate limiter - login has no throttling otherwise, leaving it open to
// brute-force/credential-stuffing against known/guessable usernames
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many login attempts. Please try again later.",
});

// rate limiter - registration spam
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many registration attempts. Please try again later.",
});

// Session Status

router.get("/fetchAuth",isAuthenticated, authController.fetchAuth);

// Local Authentication
router.post("/login", loginLimiter, passport.authenticate("local"), authController.login);

router.post("/register", registerLimiter, authController.register);

// Google OAuth Authentication
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/verify",
  passport.authenticate("google", { failureRedirect: "/" }),
  authController.googleVerify
);

router.post("/logout", authController.logout);
//routes for forgot-password
router.post("/forgot-password", forgotPasswordLimiter, authController.forgotPassword);

//route for password reset
router.get("/reset-password/:id/:token", authController.verifyResetPasswordToken);

router.post("/reset-password/:id/:token", authController.resetPassword);

module.exports = router;
