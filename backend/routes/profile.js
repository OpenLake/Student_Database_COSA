// routes/profilePhoto.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const isAuthenticated = require("../middlewares/isAuthenticated");
const profileController = require("../controllers/profileController");

router.post(
  "/photo-update",
  isAuthenticated,
  upload.fields([{ name: "image" }]),
  profileController.updateProfilePhoto
);

// Delete profile photo (reset to default)
router.delete("/photo-delete", isAuthenticated, profileController.deleteProfilePhoto);

// API to Update Student Profile
router.put("/updateStudentProfile", isAuthenticated, profileController.updateStudentProfile);

module.exports = router;
