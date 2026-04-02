const mongoose = require("mongoose");

const certificateBatchSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: "Template" },
    initiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    approverIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      required: true,
    },
    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      required: function () {
        return this.lifecycleStatus !== "Draft";
      },
    },
    lifecycleStatus: {
      type: String,
      enum: ["Draft", "Submitted", "Active", "Archived"],
      default: "Draft",
    },
    currentApprovalLevel: {
      type: Number,
      default: 0,
      max: 2,
    },
    users: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      required: function () {
        return this.lifecycleStatus === "Draft" ? false : true;
      },
    },
    signatoryDetails: {
      type: [
        {
          name: { type: String, required: true },
          signature: { type: String, default: this.name },
          role: { type: String, required: true },
        },
      ],
      required: function () {
        return this.lifecycleStatus === "Draft" ? false : true;
      },
    },
  },
  {
    timestamps: true,
  },
);

const certificateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CertificateBatch",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Approved", "Rejected"],
    },
    rejectionReason: {
      type: String,
      required: function () {
        return this.status === "Rejected";
      },
    },
    certificateUrl: {
      type: String,
      required: function () {
        return this.status === "Approved";
      },
    },
    certificateId: {
      type: String,
      required: function () {
        return this.status === "Approved";
      },
    },
  },
  {
    timestamps: true,
  },
);

//Indexed to serve the purpose of "Get pending batches for the logged-in approver."
/*

_id	approverIds	status
1	[A, B, C]	PendingL1
2	[B, D]	PendingL1
3	[A, D]	PendingL2
4	[B]	PendingL1

Index entries for B

approverIds	   _id
B	            1
B	            2
B	            4

*/
// For "Get pending batches for logged-in approver"
// Common filter: approverIds includes user, submitted batches, pending approval.
certificateBatchSchema.index(
  {
    approverIds: 1,
    approvalStatus: 1,
    lifecycleStatus: 1,
    currentApprovalLevel: 1,
  },
  {
    partialFilterExpression: {
      approvalStatus: "Pending",
      lifecycleStatus: { $in : ["Submitted"] },
    },
  },
);

//This is done to ensure that within each batch only 1 certificate is issued per userId.
certificateSchema.index({ batchId: 1, userId: 1 }, { unique: true });

//This index is for this purpose -> Get all approved certificates for the logged-in student.

certificateSchema.index(
  { userId: 1, certificateId: 1 },
  {
    unique: true,
    partialFilterExpression: { certificateId: { $exists: true } },
  },
);

const CertificateBatch = mongoose.model(
  "CertificateBatch",
  certificateBatchSchema,
);
const Certificate = mongoose.model("Certificate", certificateSchema);

module.exports = {
  CertificateBatch,
  Certificate,
};

/*

if i use partialFilter when querying i have to specify its filter condition so mongodb uses that index
so here
certificateBatchSchema.index({approverIds: 1}, {partialFilterExpression: { status: {$in: ["PendingL1", "PendingL2"]}}} )
i need to do
CertificateBatch.find({approverIds: id, status: {$in: ["PendingL1", "PendingL2"]} } )

*/
