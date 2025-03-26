const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const authController = require("../controllers/auth.controller");
const { verifyPresident } = require("../middleware/auth.middleware");

// Session Status
router.get("/fetchAuth", authController.getAuthStatus);

// Local Authentication
router.post("/login", passport.authenticate("local"), authController.login);
router.post("/register", authController.register);

// Google OAuth Authentication
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/verify",
  passport.authenticate("google", { failureRedirect: "/" }),
  authController.googleCallback,
);

router.get("/google/addId", authController.googleAddId);
router.post("/google/register", authController.googleRegister);

// User account management
router.post("/logout", authController.logout);
router.post("/updateProfile", authController.updateProfile);
router.post("/addRecord", authController.addRecord);

// System access check
router.get("/", verifyPresident, authController.checkConnection);

// Student management
router.post("/add", authController.addStudent);
router.post("/remove", authController.removeStudent);
router.post("/update", authController.updateStudent);

module.exports = router;
