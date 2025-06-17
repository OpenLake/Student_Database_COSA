// routes/profilePhoto.js
const express = require("express");
const router = express.Router();
const upload = require("../Middlewares/upload");
const cloudinary = require("cloudinary").v2;
const { Student } = require("../models/student");
const streamifier = require("streamifier");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware: Get user by ID_No
// async function getUser(req, res, next) {
//   const { ID_No } = req.body; // Get ID_No from frontend (for POST)
//   if (!ID_No) return res.status(400).json({ error: "ID_No is required" });

//   const student = await Student.findOne({ ID_No });
//   if (!student) return res.status(404).json({ error: "User not found" });

//   req.student = student;
//   next();
// }

// Upload or update profile photo
// router.post("/photo-update", upload.fields([{ name: "image" }]), async (req, res) => {
//   try {
//     const student = req.student;

//     // Delete old image from Cloudinary if exists
//     if (student.cloudinaryUrl) {
//       await cloudinary.uploader.destroy(student.cloudinaryUrl);
//     }

//     // Upload new image using upload_stream correctly
//     const streamUpload = (req) => {
//       return new Promise((resolve, reject) => {
//         let stream = cloudinary.uploader.upload_stream(
//           { folder: "profile-photos" },
//           (error, result) => {
//             if (result) resolve(result);
//             else reject(error);
//           }
//         );
//         streamifier.createReadStream(req.file.buffer).pipe(stream);
//       });
//     };

//     const result = await streamUpload(req);

//     student.profilePic= result.secure_url;
//     student.cloudinaryUrl = result.public_id;
//     await student.save();

//     res.json({ profilePic: student.profilePic });
//   } catch (err) {
//     res.status(500).json({ error: "Upload failed" });
//   }
// });
router.post(
  "/photo-update",
  upload.fields([{ name: "image" }]),
  async (req, res) => {
    try {
      const { ID_No } = req.body;
      if (!ID_No) return res.status(400).json({ error: "ID_No is required" });

      const student = await Student.findOne({ ID_No });
      if (!student) return res.status(404).json({ error: "User not found" });

      if (
        !req.files ||
        !req.files["image"] ||
        req.files["image"].length === 0
      ) {
        return res.status(400).json({ error: "Image file is required" });
      }

      const file = req.files["image"][0];

      // Delete old image if exists
      if (student.cloudinaryUrl) {
        await cloudinary.uploader.destroy(student.cloudinaryUrl);
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

      student.profilePic = result.secure_url;
      student.cloudinaryUrl = result.public_id;
      await student.save();

      res.json({ profilePic: student.profilePic });
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

    const student = await Student.findOne({ ID_No });
    if (!student) return res.status(404).json({ error: "User not found" });

    // Delete from Cloudinary if exists
    if (student.cloudinaryUrl) {
      await cloudinary.uploader.destroy(student.cloudinaryUrl);
      student.profilePic = "https://www.gravatar.com/avatar/?d=mp"; // Default photo
      student.cloudinaryUrl = "";
      await student.save();
    }

    res.json({ profilePic: student.profilePic });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
