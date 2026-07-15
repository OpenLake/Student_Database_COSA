const puppeteer = require("puppeteer");
const crypto = require("crypto");
const { User } = require("../models/schema");
const renderToPdf = require("../utils/renderPdf");
const { Certificate } = require("../models/certificateSchema");

async function generateCertificates(batch) {
  const users = await User.find({
    _id: { $in: batch.users },
  }).select("personal_info");

  const failures = [];
  let browser;

  try {
    browser = await puppeteer.launch({ headless: true });

    for (const user of users) {
      try {
        
        const existingCertificate = await Certificate.findOne({
          batchId: batch._id,
          userId: user._id,
        });

        if (existingCertificate) {
          console.log(
            `Certificate already exists for ${user.personal_info.name}. Skipping...`,
          );
          continue;
        }

        const uniqueCertificateId = `${batch._id.toString()}_${user._id.toString()}`;
      
        const certificateNumber = `COSA-${crypto
          .createHash("md5")
          .update(uniqueCertificateId)
          .digest("hex")
          .slice(0, 8)
          .toUpperCase()}`;

        const data = {
          certificateType: "Certificate of Participation",
          certificateTitle: "Certificate of Achievement",
          recipientName: user.personal_info.name,
          description:
            "In recognition of outstanding participation in the Innovation Club, demonstrating exceptional commitment, collaboration, and leadership.",
          certificateId: uniqueCertificateId, 
          certificateNumber, 
          issueDate: new Date().toLocaleDateString("en-GB"),
          
          signatories: (batch.signatoryDetails || []).map((s) => ({
            name: s.name,
            role: s.role,
          })),
        };

        // Generate PDF 
        const pdfId = await renderToPdf(data, browser);

        // Upload to Cloudinary
        // TODO: Replace with Cloudinary URL once upload networking issue is resolved.
        const certificateUrl = "#";

        if (!certificateUrl) {
          throw new Error("Cloudinary upload failed.");
        }

        // Save certificate record
        await Certificate.create({
          batchId: batch._id,
          userId: user._id,
          certificateUrl,
          certificateId: data.certificateId,
          status: "Approved",
        });

        console.log(`Certificate created for ${user.personal_info.name}`);
      } catch (userErr) {
        console.error(
          `Certificate generation failed for user ${user._id}:`,
          userErr.message,
        );
        failures.push({ userId: user._id.toString(), reason: userErr.message });
      }
    }
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeErr) {
        console.error("Failed to close browser:", closeErr.message);
      }
    }
  }

  if (failures.length > 0) {
    console.error(
      `generateCertificates: batch ${batch._id} completed with ${failures.length} failure(s):`,
      failures,
    );
    const err = new Error(
      `Certificate generation completed with ${failures.length} failure(s) out of ${users.length}.`,
    );
    err.partialFailures = failures;
    throw err;
  }
}

module.exports = generateCertificates;