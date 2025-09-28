const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
//const secretKey = process.env.JWT_SECRET_TOKEN;
const isIITBhilaiEmail = require("../utils/isIITBhilaiEmail");
const passport = require("../models/passportConfig");
const rateLimit = require("express-rate-limit");
var nodemailer = require("nodemailer");
const { User } = require("../models/schema");
//const getRole = require("../middlewares/getRole");
const isAuthenticated= require("../middlewares/isAuthenticated");

//rate limiter - for password reset try
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many password reset requests. Please try again later.",
});
// Session Status

router.get("/fetchAuth",isAuthenticated, function (req, res) {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.json(null);
  }
});

// Local Authentication
router.post("/login", passport.authenticate("local"), (req, res) => {
  // If authentication is successful, this function will be called
  const email = req.user.username;
  if (!isIITBhilaiEmail(email)) {
    console.log("Access denied. Please use your IIT Bhilai email.");
    return res.status(403).json({
      message: "Access denied. Please use your IIT Bhilai email.",
    });
  }
  res.status(200).json({ message: "Login successful", user: req.user });
});

router.post("/register", async (req, res) => {
  try {
    const { name, ID, email, password } = req.body;
    if (!isIITBhilaiEmail(email)) {
      return res.status(400).json({
        message: "Invalid email address. Please use an IIT Bhilai email.",
      });
    }
    const existingUser = await User.findOne({ username: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    //const userRole = await getRole(email);
    const newUser = await User.register(
      new User({
        user_id: ID,
        role: "STUDENT",
        strategy: "local",
        username: email,
        personal_info: {
          name: name,
          email: email,
        },
        onboardingComplete: false,
      }),
      password,
    );

    req.login(newUser, (err) => {
      if (err) {
        console.error(err);
        return res.status(400).json({ message: "Bad request." });
      }
      return res
        .status(200)
        .json({ message: "Registration successful", user: newUser });
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Google OAuth Authentication
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/verify",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    if (req.user.onboardingComplete) {
      res.redirect(`${process.env.FRONTEND_URL}/`);
    } else {
      res.redirect(`${process.env.FRONTEND_URL}/onboarding`);
    }
  },
);

router.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.send("Logout Successful");
  });
});

//routes for forgot-password
router.post("/forgot-password", forgotPasswordLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ username: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.strategy === "google") {
      return res.status(400).json({
        message:
          "This email is linked with Google Login. Please use 'Sign in with Google' instead.",
      });
    }
    const secret = user._id + process.env.JWT_SECRET_TOKEN;
    const token = jwt.sign({ email: email, id: user._id }, secret, {
      expiresIn: "10m",
    });
    const link = `${process.env.FRONTEND_URL}/reset-password/${user._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    var mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password-Reset Request",
      text: `To reset your password, click here: ${link}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Error sending email" });
      } else {
        console.log("Email sent:", info.response);
        return res
          .status(200)
          .json({ message: "Password reset link sent to your email" });
      }
    });
    console.log(link);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//route for password reset
router.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const user = await User.findOne({ _id: id });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const secret = user._id + process.env.JWT_SECRET_TOKEN;
  try {
    jwt.verify(token, secret);
    return res.status(200).json({ message: "Token verified successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
});

router.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  const user = await User.findOne({ _id: id });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const secret = user._id + process.env.JWT_SECRET_TOKEN;
  try {
    jwt.verify(token, secret);
    user.setPassword(password, async (error) => {
      if (error) {
        return res.status(500).json({ message: "Error resetting password" });
      }
      await user.save();
      return res
        .status(200)
        .json({ message: "Password has been reset successfully" });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
});

module.exports = router;
