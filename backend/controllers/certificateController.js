const { Certificate } = require("../models/certificateSchema");

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

async function getCertificates(req, res) {
  try {
    const id = req.user._id;

    const certificates = await Certificate.find({ userId: id }).populate({
      path: "batchId",
      select: "title lifecycleStatus approvalStatus",
      populate: {
        path: "eventId",
        select: "title schedule organizing_unit_id",
        populate: {
          path: "organizing_unit_id",
          select: "name",
        },
      },
    });

    const certificateObjs = certificates
      .filter((cert) => cert.batchId)
      .map((cert) => ({
        _id: cert._id,
        event: cert.batchId?.eventId?.title || "Unknown Event",
        issuedBy: cert.batchId?.eventId?.organizing_unit_id?.name || "Unknown",
        date: new Date(cert.createdAt).toLocaleDateString("en-GB"),
        status: cert.status,
        certificateUrl: cert.certificateUrl || "#",
        rejectionReason:
          cert.status === "Rejected" ? cert.rejectionReason : "",
      }));

    // Always 200 with an array (possibly empty) - see fix note above.
    return res.status(200).json({ message: certificateObjs });
  } catch (err) {
    console.error("getCertificates error:", err);
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
}

module.exports = {
  getCertificates,
};