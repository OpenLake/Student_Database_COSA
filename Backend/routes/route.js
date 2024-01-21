const express = require("express");
const passport = require("../models/passportConfig");
const router = express.Router();
const { User } = require("../models/student");

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Create a new user
    const newUser = new User({ email });
    await newUser.setPassword(password);
    await newUser.save();

    // Authenticate the user and redirect to a protected route
    req.login(newUser, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      return res
        .status(201)
        .json({ message: "Registration successful", user: newUser });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  // If authentication is successful, this function will be called
  res.status(200).json({ message: "Login successful", user: req.user });
});


module.exports = router;
