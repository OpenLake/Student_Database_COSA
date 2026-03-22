
const { Certificate } = require("../models/certificateSchema")

/**
 * {
    _id: "1",
    event: "Tech Fest 2024",
    issuedBy: "Computer Science Club",
    date: "2024-01-15",
    status: "Approved",
    certificateUrl: "#",
    rejectionReason: undefined,
    },
 */
async function getCertificates(req, res){

    const id = req.user._id;
    const certificates = await Certificate.find({userId: id}).populate([
        {
            path: "userId",
            select: "personal_info"
        },
        {
            path: "batchId",
            select: "title lifecycleStatus approvalStatus",
            populate: {
                path: "eventId",
                select: "title schedule"
            }
        }
    ]);

    if(certificates.length === 0){
        return res.status(404).json({message: "No certificates found"});
    }
    //console.log(certificates);
    
    const certificateObjs = certificates.map(cert => ({
        _id: cert._id,
        event: cert.batchId.eventId.title,
        issuedBy: cert.userId.personal_info.name,
        date: new Date(cert.createdAt).toLocaleDateString("en-GB"),
        status: cert.status,
        certificateUrl: cert.certificateUrl || "#",
        rejectionReason: cert.status === "Approved" ? cert.rejectionReason : "",
    }))

    return res.json({message: certificateObjs});
}

module.exports = {
    getCertificates
}