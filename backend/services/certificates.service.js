const puppeteer = require("puppeteer");
const crypto = require("crypto");
const { User } = require("../models/schema");
const renderToPdf = require("../utils/renderPdf");
const { uploadTocloudinary, deleteFromCloudinary } = require("../utils/cloudinary");
const { Certificate } = require("../models/certificateSchema");
const Template = require("../models/templateSchema");

async function generateCertificates(batch) {
  const users = await User.find({
    _id: { $in: batch.users },
  }).select("personal_info");

  // Pull the admin-picked template once per batch (not per user — it
  // doesn't change per recipient) so the certificate reflects what this
  // batch is actually for, instead of the same hardcoded text every time.
  const template = batch.templateId
    ? await Template.findById(batch.templateId).select("title description")
    : null;
  const certificateType = template?.title || "Certificate of Participation";
  const description =
    template?.description ||
    "In recognition of participation and contribution to this event.";

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
          certificateType,
          certificateTitle: "Certificate of Achievement",
          recipientName: user.personal_info.name,
          description,
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

        const uploadResult = await uploadTocloudinary(pdfId);

        if (!uploadResult?.secureUrl) {
          throw new Error("Cloudinary upload failed.");
        }

        // Save certificate record
        try {
          await Certificate.create({
            batchId: batch._id,
            userId: user._id,
            certificateUrl: uploadResult.secureUrl,
            certificateId: data.certificateId,
            status: "Approved",
          });
        } catch (dbErr) {
          await deleteFromCloudinary(uploadResult.publicId);
          throw dbErr;
        }

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