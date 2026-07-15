const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

function sanitizeForFilename(value) {
  return String(value)
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_");
}

 async function renderToPdf(data, sharedBrowser = null) {
  let browser = sharedBrowser;
  let ownBrowser = false;
  let page;

  try {
    if (!browser) {
      browser = await puppeteer.launch({ headless: true });
      ownBrowser = true;
    }

    page = await browser.newPage();

    const filePath = path.join(
      __dirname,
      "../template-designs/certificate.hbs",
    );
    const template = fs.readFileSync(filePath, "utf-8");

    const html = handlebars.compile(template)(data);
    await page.setContent(html, { waitUntil: "networkidle0" });

    const safeName = sanitizeForFilename(data.recipientName);
    const safeCertId = sanitizeForFilename(data.certificateId);
    const fileId = `${safeName}_${safeCertId}`;

    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const outputPath = path.join(uploadDir, `${fileId}.pdf`);
    await page.pdf({
      path: outputPath,
      width: "1122px",
      height: "794px",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    console.log("Certificate successfully generated at", outputPath);
    return fileId;
  } catch (err) {
    throw err;
  } finally {
    if (page) {
      try {
        await page.close();
      } catch(err){
       console.warn("Failed to close page:", err.message);
    }
    }
    if (ownBrowser && browser) {
      try {
        await browser.close();
      } catch(err){
      console.warn("Failed to close browser:", err.message);
      }
    }
  }
}

module.exports = renderToPdf;