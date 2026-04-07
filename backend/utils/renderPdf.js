const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

async function renderToPdf(data){
    try{
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();

        const filePath = path.join(__dirname, "../template-designs/certificate.hbs");
        const template = fs.readFileSync(filePath,"utf-8", (err, data)=>{
            if(err){
                throw new Error("Error reading files", err.message);
            }
            return data;
        })
        const html = handlebars.compile(template)(data);
        await page.setContent(html, {waitUntil: "networkidle0"});
        const userId = `${data.recipientName}_${data.certificateId}`;

        const outputPath = path.join(__dirname, "../uploads", `${userId}.pdf`);
        await page.pdf({
            path: outputPath,
            width: "1122px",
            height: "794px",
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 }
        })

        await browser.close();
        console.log("Certificate successfully generated at", outputPath);
        return userId;
    }catch(err){
        throw new Error(err);
    }
}

module.exports = renderToPdf;