const mongoose = require("mongoose");

const certificateBatchSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    unit_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizational_Unit",
    },
    commonData: { type: Map, of: String, required: true },
    templateId: { type: String, required: true },
    initiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    approverIds: {
      type: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["PendingL1", "PendingL2", "Processed", "Rejected", "Processing"],
      default: "PendingL1",
    },
    users: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      required: true,
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
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizational_Unit",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
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
      //unique: true,
      required: function () {
        return this.status === "Approved";
      },
    },
  },
  {
    timestamps: true,
  },
);

/**
 * certificateId unique constraint will reject multiple non-approved docs.
 * With unique: true, multiple pending records without certificateId can trigger duplicate-key errors.
 * Use a partial unique index instead and remove unique: true from the field.
 */

certificateSchema.index(
  { certificateId: 1 },
  {
    unique: true,
    partialFilterExpression: { certificateId: { $exists: true } },
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
certificateBatchSchema.index(
  { approverIds: 1 },
  { partialFilterExpression: { status: { $in: ["PendingL1", "PendingL2"] } } },
);

//This is done to ensure that within each batch only 1 certificate is issued per userId.
certificateSchema.index({ batchId: 1, userId: 1 }, { unique: true });

//This index is for this purpose -> Get all approved certificates for the logged-in student.

certificateSchema.index(
  { userId: 1, certificateId: 1 },
  { partialFilterExpression: { certificateId: { $exists: true } } },
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
