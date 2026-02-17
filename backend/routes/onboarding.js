const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");
const { isAuthenticated } = require("../middlewares/isAuthenticated");

// Onboarding route - to be called when user logs in for the first time
router.put("/", isAuthenticated, async (req, res) => {
  const { add_year, Program, discipline, mobile_no } = req.body;

  try {
    //console.log(req.user);
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        onboardingComplete: true,
        personal_info: Object.assign({}, req.user.personal_info, {
          phone: mobile_no || "",
        }),
        academic_info: {
          program: Program.trim(),
          branch: discipline,
          batch_year: add_year,
        },
        role: req.user.role, // required field
        strategy: req.user.strategy, // required field
      },
      { new: true, runValidators: true },
    );

    //console.log("Onboarding completed for user:", updatedUser._id);
    res.status(200).json({ message: "Onboarding completed successfully" });
  } catch (error) {
    console.error("Onboarding failed:", error);
    res.status(500).json({ message: "Onboarding failed", error });
  }
});

module.exports = router;
