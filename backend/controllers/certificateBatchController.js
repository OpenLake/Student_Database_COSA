const  { User }  = require("../models/schema");
const { CertificateBatch } = require("../models/certificateSchema");
const {
  validateBatchSchema,
  validateBatchUsersIds,
  zodObjectId,
} = require("../utils/batchValidate");
const { findEvent } = require("../services/event.service");
const { findTemplate } = require("../services/template.service");
const { getApprovers } = require("../services/user.service");
const {
  getOrganization,
  getCoordinatorOrganization,
} = require("../services/organization.service");
const { HttpError } = require("../utils/httpError");
const generateCertificates = require("../services/certificates.service");

async function createBatch(req, res) {
  try {
    const { id } = req.user;

    const {
      title,
      eventId,
      templateId,
      signatoryDetails,
      students: users,
      action,
    } = req.body;
    const validation = validateBatchSchema.safeParse({
      title,
      eventId,
      templateId,
      signatoryDetails,
      users,
    });

    if(!["Submitted", "Draft"].includes(action)){
      return res.status(400).json({message: "Invalid action"});
    }

    let lifecycleStatus, approvalStatus;
    if (action === "Submitted") {
      lifecycleStatus = "Submitted";
      approvalStatus = "Pending";
    }

    if (!validation.success) {
      let errors = validation.error.issues.map((issue) => issue.message);
      return res.status(400).json({ message: errors });
    }

    const event = await findEvent(eventId);
    const template = await findTemplate(templateId);

    // Get coordinator's organization
    const club = await getCoordinatorOrganization(req.user);

    const eventOrgId = event.organizing_unit_id.toString();
    const clubOrgId = club._id.toString();

    if (eventOrgId !== clubOrgId) {
      return res.status(403).json({
        message: "You are not authorized to initiate batches.",
      });
    }

    if (club.type.toLowerCase() !== "club") {
      return res.status(403).json({ message: "Organization is not a Club" });
    }

    // Resolve General Secretary and President objects for the club's domain.
    // approverIds MUST be stored in this exact order: [GENSEC, PRESIDENT].
    // currentApprovalLevel indexes directly into this array (0 = GENSEC's
    // turn, 1 = President's turn), so this order is load-bearing for the
    // entire approval workflow. Do not reorder without also updating
    // approveBatch/rejectBatch below.
    const { gensecObj, presidentObj } = await getApprovers(club.category);

    if (!gensecObj || !presidentObj) {
      return res.status(500).json({
        message:
          "Could not resolve GENSEC/President for this club's domain. Please contact an admin.",
      });
    }

    // Order is significant: index 0 = GENSEC, index 1 = President.
    const approverIds = [gensecObj._id, presidentObj._id];

    // Validate user ids and existence (bulk query + duplicate detection)
    const uniqueUsers = [...new Set(users.map((id) => id.toString()))];
    const duplicates = uniqueUsers.length !== users.length;
    if (duplicates) {
      return res
        .status(400)
        .json({ message: "Duplicate user ids are not allowed in a batch" });
    }

    const existing = await User.find({ _id: { $in: users } }).select("_id");
    const existingSet = new Set(existing.map((u) => u._id.toString()));

    const missing = uniqueUsers.filter((u) => !existingSet.has(u));

    if(missing.length > 0){
      missing.map((uid) => ({ uid, ok: false, reason: "User not found" }));
      return res.status(400).json({ message: "Invalid user data sent", details: missing });
    }


    const newBatch = await CertificateBatch.create({
      title,
      eventId: event._id,
      templateId: template._id,
      initiatedBy: id,
      approverIds,
      approvalStatus: approvalStatus,
      lifecycleStatus: lifecycleStatus || "Draft",
      currentApprovalLevel: 0,
      users: users,
      signatoryDetails,
    });

    try{
    // Email sending is disabled project-wide for now. Do not re-enable here.
    // await newBatchSendEmail(req.user.personal_info.email, ccEmails, link, emailBatchObj);
    } catch(err){
      console.error("Email sending failed", err.message);
    }

    res.json({ message: "New Batch created successfully" });

  } catch (err) {
    console.error(err);
    if (err instanceof HttpError) {
      const payload = { message: err.message };
      if (err.details) payload.details = err.details;
      return res.status(err.statusCode).json(payload);
    }
    res.status(500).json({ message: err.message || "Internal server error" });
  }
}

async function editBatch(req, res) {
  try {
    const { id } = req.user;
    const {
      batchId,
      title,
      eventId,
      templateId,
      signatoryDetails,
      students: users,
      action,
    } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!["Submitted", "Draft"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }
    const userIds = (users || []).map((user) =>
  typeof user === "string"
    ? user
    : user?._id
).filter(Boolean);
    const validation = validateBatchSchema.safeParse({
      title,
      eventId: eventId?._id || eventId,
      templateId,
      signatoryDetails,
      users: userIds,
    });

    const objectId = zodObjectId.safeParse(batchId);
    let errors = [];
    if (!validation.success) errors.push(...validation.error.issues);
    if (!objectId.success) errors.push(...objectId.error.issues);

    errors = errors.map((issue) => issue.message);
    if (errors.length > 0) return res.status(400).json({ message: errors });

    const batch = await CertificateBatch.findById(batchId);

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    Object.assign(batch, validation.data);

    batch.lifecycleStatus = action;

if (action === "Submitted") {
    batch.approvalStatus = "Pending";
    batch.currentApprovalLevel = 0;
}
    // NOTE: currentApprovalLevel is intentionally left untouched here.
    // See "Edge cases" notes below regarding resubmission after a rejection.
    await batch.save();

    return res.json({ message: "Batch updated successfully" });
  } catch (err) {
    if (err instanceof HttpError) {
      const payload = { message: err.message };
      if (err.details) payload.details = err.details;
      return res.status(err.statusCode).json(payload);
    }
    res.status(500).json({ message: err.message || "Internal server error" });
  }
}

async function getBatchUsers(req, res) {
  try {
    let { userIds } = req.body;
    const validation = validateBatchUsersIds.safeParse(userIds);

    if (!validation.success) {
      let errors = validation.error.issues.map((issue) => issue.message);
      return res.status(400).json({ message: errors });
    }

    const users = await User.find({ _id: { $in: userIds } }).select("username personal_info academic_info ");
    const foundIds = users.map((u) => u._id.toString());

    const missingIds = userIds.filter(
      (id) => !foundIds.includes(id.toString()),
    );
    if (missingIds.length > 0) {
      return res
        .status(404)
        .json({ message: `Users not found: ${missingIds.join(", ")}` });
    }
    return res.json({ message: users });
  } catch (err) {
    if (err instanceof HttpError) {
      const payload = { message: err.message };
      if (err.details) payload.details = err.details;
      return res.status(err.statusCode).json(payload);
    }
    res.status(500).json({ message: err.message || "Internal server error" });
  }
}

async function duplicateBatch(req, res) {
  try {
    const { batchId } = req.body;
    const { id } = req.user;

    const objectIdValidation = zodObjectId.safeParse(batchId);
    if (!objectIdValidation.success) {
      return res.status(400).json({ message: "Invalid batch ID" });
    }

    const batch = await CertificateBatch.findById(batchId)
      .select(
        "title eventId templateId initiatedBy approverIds users signatoryDetails -_id",
      );
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // Check authorization: only the initiator can duplicate
    if (batch.initiatedBy.toString() !== id) {
      return res.status(403).json({
        message: "You are not authorized to duplicate this batch",
      });
    }

    const array = batch.title.split("(Copy)");
    const count = array.length -1;
    const title = `${array[0]} Copy(${count})`;
    const newBatch = await CertificateBatch.create({
      ...batch.toObject(),
      title: title,
      lifecycleStatus: "Draft",
      currentApprovalLevel: 0,
      approvalStatus: undefined,
    });

    return res.json({ message: "Batch duplicated successfully" });
  } catch (err) {
    if (err instanceof HttpError) {
      const payload = { message: err.message };
      if (err.details) payload.details = err.details;
      return res.status(err.statusCode).json(payload);
    }
    res.status(500).json({ message: err.message || "Internal server error" });
  }
}

async function deleteBatch(req, res) {
  try {
    const { batchId } = req.body;
    const { id } = req.user;

    const objectIdValidation = zodObjectId.safeParse(batchId);
    if (!objectIdValidation.success) {
      return res.status(400).json({ message: "Invalid batch ID" });
    }

    const batch = await CertificateBatch.findOneAndDelete({
      _id: batchId,
      initiatedBy: id,
    });
    if (!batch) {
      return res
        .status(403)
        .json({ message: "Batch not found or unauthorized" });
    }

    return res.json({ message: "Batch deleted successfully" });
  } catch (err) {
    if (err instanceof HttpError) {
      const payload = { message: err.message };
      if (err.details) payload.details = err.details;
      return res.status(err.statusCode).json(payload);
    }
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
}

async function archiveBatch(req, res) {
  try {
    const { batchId } = req.body;
    const { id } = req.user;

    const objectIdValidation = zodObjectId.safeParse(batchId);
    if (!objectIdValidation.success) {
      return res.status(400).json({ message: "Invalid batch ID" });
    }

    const batch = await CertificateBatch.findOneAndUpdate(
      { _id: batchId, initiatedBy: id },
      { lifecycleStatus: "Archived" },
      { new: true },
    );
    if (!batch) {
      return res
        .status(403)
        .json({ message: "Batch not found or unauthorized" });
    }

    return res.json({ message: "Batch archived successfully" });
  } catch (err) {
    if (err instanceof HttpError) {
      const payload = { message: err.message };
      if (err.details) payload.details = err.details;
      return res.status(err.statusCode).json(payload);
    }
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
}

async function getUserBatches(req, res) {
  try {
    const id  = req.user._id;
    const userId = req.params.userId;
    let batches;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "PRESIDENT" || user.role.startsWith("GENSEC")) {
      batches = await CertificateBatch.find({
        approverIds: id,
        lifecycleStatus: { $ne: "Draft" },
      });
    } else {
      if (id.toString() !== userId.toString()) {
        return res.status(403).json({ message: "User is Unauthorized" });
      }
      batches = await CertificateBatch.find({
        initiatedBy: id,
      });
    }

    batches = await CertificateBatch.populate(batches, [
  {
    path: "eventId",
    select: "title organizing_unit_id schedule",
    populate: {
      path: "organizing_unit_id",
      select: "name",
    },
  },
  {
    path: "initiatedBy",
    select: "personal_info",
  },
  {
    path: "users",
    select: "personal_info academic_info",
  },
  {
    path: "approverIds",
    select: "personal_info",
  },
]);
    if (!batches || batches.length === 0) {
      return res.status(200).json({
        message: batches,
        info: batches.length === 0
          ? "No batches found"
          : undefined,
        });
    }

    return res.json({ message: batches });
  } catch (err) {
    if (err instanceof HttpError) {
      const payload = { message: err.message };
      if (err.details) payload.details = err.details;
      return res.status(err.statusCode).json(payload);
    }
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
}

async function approverEditBatch(req, res) {
  const { id } = req.user;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role !== "PRESIDENT" && !user.role.startsWith("GENSEC")) {
    return res.status(403).json({ message: "Access denied" });
  }

  let { users } = req.body;
  const validation = validateBatchUsersIds.safeParse(users);
  if (!validation.success) {
    let errors = validation.error.issues.map((issue) => issue.message);
    return res.status(400).json({ message: errors });
  }

  const { _id } = req.body;
  const batch = await CertificateBatch.findById(_id);
  if (!batch) {
    return res.status(404).json({ message: "Batch not found" });
  }
  batch.users = users;
  await batch.save();

  res.status(200).json({ message: "Batch updated successfully" });
}

/**
 * Approve a batch.
 *
 * FIX (Problem 1/2/3/4): membership in approverIds is NOT sufficient to
 * approve. The caller must be the approver AT THE CURRENT LEVEL
 * (batch.approverIds[batch.currentApprovalLevel]). The state transition is
 * also performed as a single atomic findOneAndUpdate keyed on the current
 * level, so two concurrent/duplicate requests can't both succeed and
 * double-generate certificates.
 */
async function approveBatch(req, res) {
  try {
    const batchId = req.params.batchId;
    const { id } = req.user;

    const validateId = zodObjectId.safeParse(batchId);
    if (!validateId.success) {
      return res.status(400).json({ message: "Invalid batch ID" });
    }

    const batch = await CertificateBatch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // Prevent approving an already approved / non-submitted batch
    if (
      batch.approvalStatus === "Approved" ||
      batch.lifecycleStatus === "Active"
    ) {
      return res.status(400).json({
        message: "Batch has already been approved.",
      });
    }

    if (batch.lifecycleStatus !== "Submitted") {
      return res.status(400).json({
        message: "Batch is not currently awaiting approval.",
      });
    }

    const level = batch.currentApprovalLevel;

    if (level !== 0 && level !== 1) {
      return res.status(400).json({
        message: "Batch is not awaiting approval at this stage.",
      });
    }

    // Whose turn is it, really? (index 0 = GENSEC, index 1 = President)
    const expectedApproverId = batch.approverIds[level];
    if (!expectedApproverId || expectedApproverId.toString() !== id.toString()) {
      return res.status(403).json({
        message: "It is not your turn to approve this batch yet.",
      });
    }

    // Atomic transition: the match query re-verifies both the level AND
    // that this exact user occupies that array position, at write time.
    // If another request already advanced the level, this update matches
    // nothing and updatedBatch comes back null.
    const matchQuery = {
      _id: batchId,
      currentApprovalLevel: level,
    };
    matchQuery[`approverIds.${level}`] = id;

    let update;
    if (level === 0) {
      // GENSEC approval -> hand off to President
      update = {
        currentApprovalLevel: 1,
        lifecycleStatus: "Submitted",
        approvalStatus: "Pending",
      };
    } else {
      // President (final) approval -> batch becomes Active
      update = {
        currentApprovalLevel: 2,
        lifecycleStatus: "Active",
        approvalStatus: "Approved",
      };
    }

    const updatedBatch = await CertificateBatch.findOneAndUpdate(
      matchQuery,
      update,
      { new: true },
    );

    if (!updatedBatch) {
      return res.status(409).json({
        message:
          "This batch was already updated by another approver. Please refresh.",
      });
    }

    if (level === 1) {
      // Final (President) approval just happened - generate certificates
      // exactly once, from the freshly-updated, level===2 document.
      await generateCertificates(updatedBatch);
    }

    return res.status(200).json({
      message:
        level === 0
          ? "Batch approved by GENSEC. Forwarded to President."
          : "Batch approved successfully. Certificates are being generated.",
    });
  } catch (err) {
    if (err instanceof HttpError) {
      const payload = { message: err.message };
      if (err.details) payload.details = err.details;
      return res.status(err.statusCode).json(payload);
    }

    return res.status(500).json({
      message: err.message || "Internal server error",
    });
  }
}

/**
 * Reject a batch.
 *
 * FIX (Problem 1/6): same turn-based check as approveBatch - only the
 * approver at the current level may reject.
 *
 * FIX (crash bug): the previous implementation read
 * `batch.approverIds.find(a => a._id...)` and `batch.eventId.title` /
 * `batch.initiatedBy.personal_info.name` on a batch fetched WITHOUT
 * .populate(). Those fields are raw ObjectIds, not populated documents, so
 * `a._id` and `.personal_info` were always undefined, and
 * `currentApprover.email` threw a TypeError on every single reject call.
 * Since email sending is disabled project-wide right now, that entire
 * object-building block has been removed rather than "fixed", to avoid
 * resurrecting dead/untested email code.
 *
 * BEHAVIOR CHANGE: the previous code incremented `currentApprovalLevel` on
 * rejection (e.g. GENSEC reject moved level 0 -> 1, effectively handing the
 * batch to the President next). That looked unintentional - rejecting
 * shouldn't advance the approval chain forward. This version marks the
 * batch Rejected and leaves currentApprovalLevel untouched. Please confirm
 * this matches the workflow you want (see "Edge cases" notes below on what
 * should happen when the coordinator edits and resubmits after a
 * rejection).
 */
async function rejectBatch(req, res) {
  try {
    const batchId = req.params.batchId;
    const { id } = req.user;

    const validateId = zodObjectId.safeParse(batchId);
    if (!validateId.success) {
      return res.status(400).json({ message: "Invalid batch ID" });
    }

    const batch = await CertificateBatch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    if (batch.lifecycleStatus !== "Submitted") {
      return res.status(400).json({
        message: "Batch is not currently awaiting approval.",
      });
    }

    const level = batch.currentApprovalLevel;
    if (level !== 0 && level !== 1) {
      return res.status(400).json({
        message: "Batch is not awaiting approval at this stage.",
      });
    }

    const expectedApproverId = batch.approverIds[level];
    if (!expectedApproverId || expectedApproverId.toString() !== id.toString()) {
      return res.status(403).json({
        message: "It is not your turn to act on this batch yet.",
      });
    }

    const matchQuery = { _id: batchId, currentApprovalLevel: level };
    matchQuery[`approverIds.${level}`] = id;

    const updatedBatch = await CertificateBatch.findOneAndUpdate(
      matchQuery,
      {
        approvalStatus: "Rejected",
        lifecycleStatus: "Submitted",
      },
      { new: true },
    );

    if (!updatedBatch) {
      return res.status(409).json({
        message:
          "This batch was already updated by another approver. Please refresh.",
      });
    }

    // Email notifications are disabled project-wide. Do not add them back.

    return res.status(200).json({ message: "Batch rejected successfully" });
  } catch (err) {
    if (err instanceof HttpError) {
      const payload = { message: err.message };
      if (err.details) payload.details = err.details;
      return res.status(err.statusCode).json(payload);
    }
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
}

module.exports = {
  createBatch,
  editBatch,
  getBatchUsers,
  duplicateBatch,
  deleteBatch,
  archiveBatch,
  getUserBatches,
  approverEditBatch,
  approveBatch,
  rejectBatch,
};