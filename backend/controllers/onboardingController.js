const { User } = require("../models/schema");

exports.completeOnboarding = async (req, res) => {
  const { ID_No, add_year, Program, discipline, mobile_no } = req.body;

  try {
    console.log(req.user);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        user_id: ID_No,
        onboardingComplete: true,
        personal_info: {
          ...req.user.personal_info,
          phone: mobile_no || "",
        },
        academic_info: {
          program: Program.trim(),
          branch: discipline,
          batch_year: add_year,
        },
        role: req.user.role,
        strategy: req.user.strategy,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    console.log(
      "Onboarding completed for user:",
      updatedUser._id
    );

    return res.status(200).json({
      message: "Onboarding completed successfully",
    });
  } catch (error) {
    console.error(
      "Onboarding failed:",
      error
    );

    return res.status(500).json({
      message: "Onboarding failed",
      error,
    });
  }
};