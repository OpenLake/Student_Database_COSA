const User = require("../models/userSchema");
const renderToPdf = require("../utils/renderPdf");
const uploadTocloudinary = require("../utils/cloudinary");
const {Certificate} = require("../models/certificateSchema");

async function generateCertificates(batch){
    try{
        /**
         * 1. Render PDF
         * 2. use cloudinary to host the files
         * 3. create certifcate docs
         */
    
        const users = await User.find({_id: {$in: batch.users}}).select("personal_info");
        
        for(let user of users){
            const data = { 
                certificateType: 'Certificate of Participation',
                certificateTitle: 'Certificate of Achievement',
                recipientName: user.personal_info.name,
                description: "in recognition of outstanding participation in the Innovation Club, demonstrating exceptional commitment, collaboration, and leadership",
                certificateId: user._id,
                issueDate: Date.now().toLocaleString("en-GB").replaceAll("/", "-"),
                signatories: batch.signatoryDetails
            }
            
            const pdfId = await renderToPdf(data);        
            const url = await uploadTocloudinary(pdfId);
    
            await Certificate.create({
                batchId: batch._id,
                userId: user._id,
                certificateUrl: url,
                certificateId: pdfId,
                status: "Approved"
            });
            
        }
    }catch(err){
        console.log(err);
        throw err;
    }
}

module.exports = generateCertificates