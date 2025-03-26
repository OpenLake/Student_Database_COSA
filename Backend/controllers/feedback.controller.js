const Feedback = require("../models/feedback.model"); // Adjust path as needed
const mongoose = require("mongoose");

// Feedback controller
const feedbackController = {
  // Submit feedback
  submitFeedback: async (req, res) => {
    try {
      let { userId, type, description } = req.body;

      console.log("Received request:", req.body);

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error("Invalid userId format:", userId);
        return res.status(400).json({ error: "Invalid userId format" });
      }

      const feedback = new Feedback({ userId, type, description });
      await feedback.save();

      console.log("Feedback saved successfully:", feedback);
      res.status(201).json({ message: "Feedback submitted", feedback });
    } catch (error) {
      console.error("Error in /feedback route:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get feedback for a specific user
  getUserFeedback: async (req, res) => {
    try {
      const feedbacks = await Feedback.find({ userId: req.params.userId });
      res.json(feedbacks);
    } catch (error) {
      res.status(500).json({ error: "Server Error" });
    }
  },

  // Get all feedback
  getAllFeedback: async (req, res) => {
    try {
      const feedbacks = await Feedback.find();
      res.json(feedbacks);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },
};

module.exports = feedbackController;
