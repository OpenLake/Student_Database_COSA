// routes/profilePhoto.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const cloudinary = require("cloudinary").v2;
//const { Student } = require("../models/student");
const { User } = require("../models/schema");
const streamifier = require("streamifier");
const isAuthenticated = require("../middlewares/isAuthenticated");
// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post(
  "/photo-update",isAuthenticated,
  upload.fields([{ name: "image" }]),
  async (req, res) => {
    try {
      const { ID_No } = req.body;
      if (!ID_No) { return res.status(400).json({ error: "ID_No is required" }); }

      const user = await User.findOne({ user_id: ID_No });
      if (!user) { return res.status(404).json({ error: "User not found" });}

      if (
        !req.files ||
        !req.files["image"] ||
        req.files["image"].length === 0
      ) {
        return res.status(400).json({ error: "Image file is required" });
      }

      const file = req.files["image"][0];

      // Delete old image if exists
      if (user.personal_info.cloudinaryUrl) {
        await cloudinary.uploader.destroy(user.personal_info.cloudinaryUrl);
      }

      // Upload new image using upload_stream
      const streamUpload = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream(
            { folder: "profile-photos" },
            (error, result) => {
              if (result) { resolve(result);}
              else { reject(error); }
            },
          );
          streamifier.createReadStream(fileBuffer).pipe(stream);
        });
      };

      const result = await streamUpload(file.buffer);

      user.personal_info.profilePic = result.secure_url;
      user.personal_info.cloudinaryUrl = result.public_id;
      await user.save();

      res.json({ profilePic: user.personal_info.profilePic });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: "Upload failed" });
    }
  },
);

// Delete profile photo (reset to default)
router.delete("/photo-delete",isAuthenticated, async (req, res) => {
  try {
    const { ID_No } = req.query; // Get ID_No from frontend for DELETE
    if (!ID_No) { return res.status(400).json({ error: "ID_No is required" }); }

    const user = await user.findOne({ user_id: ID_No });
    if (!user) { return res.status(404).json({ error: "User not found" }); }

    // Delete from Cloudinary if exists
    if (user.personal_info.cloudinaryUrl) {
      await cloudinary.uploader.destroy(user.personal_info.cloudinaryUrl);
      user.personal_info.profilePic = "https://www.gravatar.com/avatar/?d=mp"; // Default photo
      user.personal_info.cloudinaryUrl = "";
      await user.save();
    }

    res.json({ profilePic: user.personal_info.profilePic });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

// API to Update Student Profile 
router.put("/updateStudentProfile",isAuthenticated, async (req, res) => {
  try {
    const { userId, updatedDetails } = req.body;
    console.log("Received userId:", userId);
    console.log("Received updatedDetails:", updatedDetails);

    if (!userId || !updatedDetails) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const user = await User.findOne({ user_id: userId }); // <-- updated from ID_No

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // ---------- PERSONAL INFO ----------
    if (updatedDetails.personal_info) {
      const {
        name,
        email,
        phone,
        gender,
        date_of_birth,
        profilePic,
        cloudinaryUrl,
      } = updatedDetails.personal_info;

      if (name) { user.personal_info.name = name; }
      if (email) { user.personal_info.email = email; }
      if (phone) { user.personal_info.phone = phone; }
      if (gender) { user.personal_info.gender = gender; }
      if (date_of_birth) { user.personal_info.date_of_birth = date_of_birth; }
      if (profilePic) { user.personal_info.profilePic = profilePic; }
      if (cloudinaryUrl) { user.personal_info.cloudinaryUrl = cloudinaryUrl; }
    }

    // ---------- ACADEMIC INFO ----------
    if (updatedDetails.academic_info) {
      const { program, branch, batch_year, current_year, cgpa } =
        updatedDetails.academic_info;

      if (program) { user.academic_info.program = program; }
      if (branch) { user.academic_info.branch = branch; }
      if (batch_year) { user.academic_info.batch_year = batch_year; }
      if (current_year) { user.academic_info.current_year = current_year; }
      if (cgpa !== undefined) { user.academic_info.cgpa = cgpa; }
    }

    // ---------- CONTACT INFO ----------
    if (updatedDetails.contact_info) {
      const { hostel, room_number, socialLinks } = updatedDetails.contact_info;

      if (hostel) { user.contact_info.hostel = hostel; }
      if (room_number) { user.contact_info.room_number = room_number; }

      // Social Links
      if (socialLinks) {
        user.contact_info.socialLinks.github =
          socialLinks.github != null
            ? socialLinks.github
            : user.contact_info.socialLinks.github;

        user.contact_info.socialLinks.linkedin =
          socialLinks.linkedin != null
            ? socialLinks.linkedin
            : user.contact_info.socialLinks.linkedin;

        user.contact_info.socialLinks.instagram =
          socialLinks.instagram != null
            ? socialLinks.instagram
            : user.contact_info.socialLinks.instagram;

        user.contact_info.socialLinks.other =
          socialLinks.other != null
            ? socialLinks.other
            : user.contact_info.socialLinks.other;
      }
    }

    // Update the updated_at timestamp
    user.updated_at = new Date();

    // Save changes
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Student profile updated successfully",
      updatedStudent: user,
    });
  } catch (error) {
    console.error("Error updating student profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
