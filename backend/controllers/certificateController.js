
const { Certificate } = require("../models/certificateSchema")
const Event = require("../models/eventSchema");
//status, rejectionReason, issuedBy:name,type eventName, Date(start-end)
async function getCertificates(req, res){

    const id = req.user._id;
    const certificates = await Certificate.find({userId: id}).populate({
        path: "batchId",
        select: "eventId -_id"
    }).lean();

    if(certificates.length === 0){
        return res.status(404).json({message: "No certificates found"});
    }
    console.log(certificates);
    let certificateObjects = await Promise.all(
        certificates.map(async (cert) => {
            if (!cert.batchId?.eventId) return {};
            const eventDetails = await Event.findById(cert.batchId.eventId)
            .select("title schedule organizing_unit_id -_id")
            .populate({
                path: "organizing_unit_id",
                select: "name type -_id"
            })

            if(!eventDetails) return {};
            cert.eventDetails = eventDetails;     
            return cert;
        })
    );

    certificateObjects = certificateObjects.filter((obj) => Object.keys(obj).length > 0);
    console.log(certificateObjects);

    return res.json({message: "User Certificates fetched successfully", success: true, data: certificateObjects});
}

module.exports = {
    getCertificates
}