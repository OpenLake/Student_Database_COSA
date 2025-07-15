// routes/profilePhoto.js
const express = require("express");
const router = express.Router();
const upload = require("../Middlewares/upload");
const cloudinary = require("cloudinary").v2;
//const { Student } = require("../models/student");
const User = require("../models/schema");
const streamifier = require("streamifier");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post(
  "/photo-update",
  upload.fields([{ name: "image" }]),
  async (req, res) => {
    try {
      const { ID_No } = req.body;
      if (!ID_No) return res.status(400).json({ error: "ID_No is required" });

      const user = await User.findOne({ user_id: ID_No });
      if (!user) return res.status(404).json({ error: "User not found" });

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
              if (result) resolve(result);
              else reject(error);
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
router.delete("/photo-delete", async (req, res) => {
  try {
    const { ID_No } = req.query; // Get ID_No from frontend for DELETE
    if (!ID_No) return res.status(400).json({ error: "ID_No is required" });

    const user = await user.findOne({ user_id: ID_No });
    if (!user) return res.status(404).json({ error: "User not found" });

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

module.exports = router;
