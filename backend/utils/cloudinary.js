const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadTocloudinary(pdfId) {
    const pdfPath = path.join(__dirname, "../uploads", `${pdfId}.pdf`);

    try {
        const result = await cloudinary.uploader.upload(pdfPath, {
            resource_type: "raw",
            folder: "certificates",
            timeout: 120000,
        });

        return { secureUrl: result.secure_url, publicId: result.public_id };
    } catch (err) {
        console.error("Cloudinary upload failed:");
        console.dir(err, { depth: null });
        throw err;
    } finally {
        if (fs.existsSync(pdfPath)) {
            fs.unlinkSync(pdfPath);
        }
    }
}

async function deleteFromCloudinary(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
  } catch (err) {
    console.error(`Failed to delete orphaned Cloudinary asset ${publicId}:`, err.message);
  }
}

module.exports = { uploadTocloudinary, deleteFromCloudinary };