const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

async function uploadTocloudinary(pdfId) {
    const pdfPath = path.join(__dirname, "../uploads", `${pdfId}.pdf`);

    try {
        const result = await cloudinary.uploader.upload(pdfPath, {
            resource_type: "raw",
            folder: "certificates",
            timeout: 120000,
        });

        return result.secure_url;
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

module.exports = uploadTocloudinary;