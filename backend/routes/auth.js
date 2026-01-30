const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

//const isIITBhilaiEmail = require("../utils/isIITBhilaiEmail");

const { loginValidate, registerValidate } = require("../utils/authValidate");
const passport = require("../config/passportConfig");
const rateLimit = require("express-rate-limit");
var nodemailer = require("nodemailer");
const { User } = require("../models/schema");
const { isAuthenticated } = require("../middlewares/isAuthenticated");

const bcrypt = require("bcrypt");

//rate limiter - for password reset try
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many password reset requests. Please try again later.",
});
// Session Status

router.get("/fetchAuth", isAuthenticated, function (req, res) {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.json(null);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = loginValidate.safeParse({ username, password });

    if (!result.success) {
      return res
        .status(400)
        .json({ message: result.error.message || "Invalid data sent" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.json(401).json({ message: "Invalid user credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.json(401).json({ message: "Invalid user credentials" });
    }

    const payload = {
      id: user._id.toString(),
    };

    //console.log(payload);

    const token = jwt.sign(payload, process.env.JWT_SECRET_TOKEN, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      maxAge: 5 * 60 * 1000,
    });

    res.json({ message: "Login Successful", token: token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, password, user_id, name, role } = req.body;
    const result = registerValidate.safeParse({
      username,
      password,
      user_id,
      name,
      role,
    });

    if (!result.success) {
      return res.status(400).json({ message: result.error.message });
    }

    const user = await User.findOne({ username });
    if (user) {
      return res
        .json(401)
        .json({ message: "Account with username already exists" });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT),
    );

    const newUser = await User.create({
      user_id,
      role,
      strategy: "local",
      username,
      password: hashedPassword,
      personal_info: {
        name,
        email: username,
      },
    });

    return res.json({ message: "Registered Successfully", user: newUser });
  } catch (err) {
    return res.status(500).json({ message: err.message });
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
