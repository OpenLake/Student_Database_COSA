const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { registerValidate } = require("../utils/authValidate");
const passport = require("../config/passportConfig");
const rateLimit = require("express-rate-limit");
const {forgotPasswordSendEmail} = require("../services/email.service");

const User = require("../models/userSchema");
const { isAuthenticated } = require("../middlewares/isAuthenticated");

//const bcrypt = require("bcrypt");

//rate limiter - for password reset try
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many password reset requests. Please try again later.",
});
// Session Status

router.get("/fetchAuth", isAuthenticated, function (req, res) {
  //console.log(req.user);
  const { personal_info, role, onboardingComplete, _id, ...restData } =
    req.user;
  res.json({ message: { personal_info, role, onboardingComplete, _id } });
});

/**
 * User POST /auth/login
        ↓
    passport.authenticate("local")
            ↓
    LocalStrategy (validate credentials)
            ↓
    done(null, user)
            ↓
    req.login(user) called
            ↓
    serializeUser(user) → store ID in session
            ↓
    Session saved → session cookie sent
 */
router.post("/login", async (req, res) => {
  try {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (!user)
        return res
          .status(401)
          .json({ message: info?.message || "Login failed" });

      // if using a custom callback like this u have to manually call req.login() else not needed
      //this will seralize user, store id in session, save session and send cookie
      req.login(user, (err) => {
        if (err)
          return res.status(500).json({ message: "Internal server error" });
        const { personal_info, role, onboardingComplete, _id, ...restData } =
          user;
        return res.json({
          message: "Login Successful",
          success: true,
          data: { personal_info, role, onboardingComplete, _id },
        });
      });
    })(req, res);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, password, name } = req.body;
    const role = "STUDENT";
    const result = registerValidate.safeParse({
      username,
      password,
      name,
      role,
    });

    if (!result.success) {
      const errors = result.error.issues.map((issue) => issue.message);
      return res.status(400).json({ message: errors, success: false });
    }

    const user = await User.findOne({ username });
    if (user) {
      return res.status(409).json({
        message: "Account with username already exists",
        success: false,
      });
    }

    /**
     * This logic is now embedded in the pre save hook
     * const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT),
    );
     */

    const newUser = await User.create({
      strategy: "local",
      username,
      password,
      personal_info: {
        name,
        email: username,
      },
      role,
    });
    //console.log(newUser);

    //return res.json({ message: "Registered Successfully", user: newUser });
    return res.json({ message: "Registered Successfully", success: true });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Google OAuth Authentication
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get("/google/verify", function (req, res) {
  //console.log("in verify");
  passport.authenticate("google", (err, user, info) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (!user)
      return res
        .status(401)
        .json({ message: info?.message || "Google Authentication failed" });

    /**
     * if(!user.onboardingComplete){
      return res.redirect(`${process.env.FRONTEND_URL}/onboarding`)
    }
     */
    //return res.redirect(`${process.env.FRONTEND_URL}`);

    req.login(user, (loginErr) => {
      if (loginErr) {
        console.error("Login error:", loginErr);
        return res.status(500).json({ message: "Error establishing session" });
      }

      /*console.log("User logged in successfully:", user.username);
      console.log("OnboardingComplete:", user.onboardingComplete);
      */
      if (!user.onboardingComplete) {
        //console.log("Redirecting to onboarding");
        return res.redirect(`${process.env.FRONTEND_URL}/onboarding`);
      }

      //console.log("Redirecting to home");
      return res.redirect(`${process.env.FRONTEND_URL}`);
    });
  })(req, res);
});

router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).json({ message: "Error during logout" });
    }

    // Destroy the session
    // req.session.destroy will remove the session from session store and invalidate ids or fields
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: "Error destroying session" });
      }

      // Clear the session cookie
      res.clearCookie("token", {
        path: "/",
        secure: process.env.NODE_ENV === "production", // HTTPS only in prod
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // cross-origin in prod
        maxAge: 0,
        httpOnly: true,
      });

      res.json({ message: "Logged out successfully" });
    });
  });
});

//routes for forgot-password
router.post("/", forgotPasswordLimiter, async (req, res) => {
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
    await forgotPasswordSendEmail(email, link);
   
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//route for password reset
router.get("/reset-password/:id/:token", async (req, res) => {
  try {
    const { id, token } = req.params;
    console.log(req.params);
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const secret = user._id + process.env.JWT_SECRET_TOKEN;
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
