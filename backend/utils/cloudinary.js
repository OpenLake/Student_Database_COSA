const path = require("path");
require("dotenv").config({path: path.resolve(__dirname, "../.env")});
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

async function uploadTocloudinary(pdfId){
    try{
        const pdfPath = path.join(__dirname, "../uploads", `${pdfId}.pdf`);
        const result = await cloudinary.uploader.upload(pdfPath, {
            resource_type: "raw",
            //this will store certs in folder certificates on cloudinary
            folder: "certificates"
        });

        fs.unlink(pdfPath, (err)=>{
            if(err) throw new Error(err);
            console.log("File unlinked successfully");
            return ;
        })

        return result.secure_url;
    }catch(err){
        console.log(err);
        throw err;
    }
}   

module.exports = uploadTocloudinary;