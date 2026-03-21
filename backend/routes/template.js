const router = require("express").Router();
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const Template = require("../models/templateSchema");

router.get("/", isAuthenticated, async function (req, res) {
  try {
    const templates = await Template.find();
    if (!templates) {
      return res.status(404).json({ message: "No templates found" });
    }
    res.json({ message: templates });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
